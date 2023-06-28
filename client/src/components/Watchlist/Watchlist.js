import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import {
    Heading,
    Flex,
    Box,
    Center,
    FormControl,
    FormHelperText,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import {
    getWatchlist,
    getPriceHistory,
    getLastPrice,
    getCurrency,
    getSymbols,
    postWatchItem,
    deleteWatchItem,
    getCompanyProfile,
    putSymbolPrice,
} from '../../global/axios';
import CandleStick from './CandleStick';
import Statistics from './Statistics';
import ObjList from '../ObjList';
import '../../styles/global.scss';
// import useWebSocket from 'react-use-websocket';
import dayjs from 'dayjs';

function Watchlist(props) {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [watchlist, setWatchlist] = useState({});
    const [isWatchlistLoaded, setIsWatchlistLoaded] = useState(false);
    const [exRate, setExRate] = useState(1);
    const [candlestickData, setCandleStickData] = useState([]);
    const [chartScale, setChartScale] = useState('1Y');
    const [ticker, setTicker] = useState('');
    const [existing, setExising] = useState(false);
    const [searchTicker, setSearchTicker] = useState('');
    const [listLength, setListLength] = useState(0);
    const symbolOptions = useRef([]);
    const { lastMessage, sendMessage, setSubscribe, unsubscribeAll } = props;

    // const FINNHUB_KEY = process.env.REACT_APP_FINNHUB_KEY;
    // const [socketUrl, setSocketUrl] = useState(
    //     `wss://ws.finnhub.io?token=${FINNHUB_KEY}`
    // );
    // const { sendMessage, lastMessage } = useWebSocket(socketUrl, {
    //     onOpen: () => console.log('Link Start'),
    //     shouldReconnect: closeEvent => true,
    // });

    const wsInitial = () => {
        unsubscribeAll();
        const keyList = Object.keys(watchlist);
        setSubscribe(keyList);
        for (const symbol of keyList) {
            sendMessage(JSON.stringify({ type: 'subscribe', symbol: symbol }));
            console.log('sub:', symbol);
        }
    };

    const wsChange = useCallback(
        (type, symbol) => {
            sendMessage(JSON.stringify({ type: type, symbol: symbol }));
        },
        [sendMessage]
    );

    const updateWatchlist = async () => {
        if (isWatchlistLoaded) {
            let newWatchlist = {};
            const keyList = Object.keys(watchlist);
            for (let i = 0; i < keyList.length; i++) {
                const ticker = keyList[i];
                const watchItem = watchlist[ticker];
                const diff = dayjs().diff(dayjs(watchItem.updated_at), 's');

                if (diff > 60 || watchItem.price === 0) {
                    const quote = await getLastPrice(ticker);
                    const { c: currentPrice, pc: previousClose } = quote.data;
                    watchItem.price = currentPrice;
                    watchItem.prev_close = previousClose;
                    await putSymbolPrice({
                        symbol: ticker,
                        price: currentPrice,
                        prevClose: previousClose,
                    });
                }

                newWatchlist[ticker] = watchItem;
            }
            setWatchlist(newWatchlist);
        }
    };

    const updatePrice = (symbol, price) => {
        let newWatchlist = { ...watchlist };
        if (symbol in watchlist) {
            newWatchlist[symbol].price = price;
        }
        setWatchlist(newWatchlist);
    };

    const convertArray2Dict = array => {
        let dict = {};
        for (const item of array) {
            dict[item.ticker] = item;
        }
        return dict;
    };

    const changeTicker = symbol => {
        setTicker(symbol);
    };

    const changeScale = scale => {
        setChartScale(scale);
    };

    const findTicker = selected => {
        setSearchTicker(selected.value);
        if (selected.value in watchlist) {
            setExising(true);
        } else {
            setExising(false);
        }
        return;
    };

    const addTicker = async () => {
        if (searchTicker !== '' && !existing) {
            const quote = await getLastPrice(searchTicker);
            const profile = await getCompanyProfile(searchTicker);
            const { c: currentPrice, pc: prevClose } = quote.data;
            const { logo, name, exchange, finnhubIndustry, currency } =
                profile.data;

            let newWatchFE = {
                id: `${userId}-${searchTicker}`,
                user_id: userId,
                logo: logo,
                ticker: searchTicker,
                price: currentPrice,
                prev_close: prevClose,
                currency: currency,
            };

            let newWatchBE = {
                id: `${userId}-${searchTicker}`,
                user_id: userId,
                name: name,
                exchange: exchange,
                sector: finnhubIndustry,
                logo: logo,
                ticker: searchTicker,
                price: currentPrice,
                prev_close: prevClose,
                currency: currency,
            };

            let newWatchlist = { ...watchlist };
            newWatchlist[searchTicker] = newWatchFE;
            setWatchlist(newWatchlist);
            setTicker(searchTicker);
            await postWatchItem(newWatchBE);
            setSearchTicker('');
            wsChange('subscribe', searchTicker);
            setListLength(Object.keys(newWatchlist).length);
            setSubscribe(Object.keys(newWatchlist));
        }
    };

    const deleteItem = ticker => {
        let newWatchlist = { ...watchlist };
        if (ticker in watchlist) {
            delete newWatchlist[ticker];
            setWatchlist(newWatchlist);
            deleteWatchItem(`${userId}-${ticker}`);
            wsChange('unsubscribe', ticker);
            setListLength(Object.keys(newWatchlist).length);
            setSubscribe(Object.keys(newWatchlist));
        }
        return;
    };

    useEffect(() => {
        const username = sessionStorage.getItem('userId');
        setUserId(username);

        if (username === '') {
            navigate('/');
        } else {
            getWatchlist(username).then(response => {
                const dataObj = convertArray2Dict(response.data);
                setWatchlist(dataObj);
                setIsWatchlistLoaded(true);
                setTicker(response.data[0].ticker);
            });
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (isWatchlistLoaded) {
            updateWatchlist();
            wsInitial();
        }
        // eslint-disable-next-line
    }, [isWatchlistLoaded]);

    useEffect(() => {
        if (lastMessage !== null) {
            const json = JSON.parse(lastMessage.data);
            const type = json.type;
            if (type === 'trade') {
                const data = json.data;
                const price = data[0].p;
                const symbol = data[0].s;
                updatePrice(symbol, price);
            }
        }
        // eslint-disable-next-line
    }, [lastMessage]);

    useEffect(() => {
        getSymbols().then(response => {
            const symbols = response.data;
            const formattedSymbols = symbols.map(item => {
                return {
                    value: item.symbol,
                    label: item.symbol,
                };
            });
            symbolOptions.current = formattedSymbols;
        });
    }, []);

    useEffect(() => {
        if (ticker === '') return;
        getPriceHistory(ticker, chartScale).then(response => {
            if (response.data.s !== 'ok') return;
            const {
                c: close,
                h: high,
                l: low,
                o: open,
                t: time,
                v: volume,
            } = response.data;
            const lengths = [time, close, high, low, open, volume].map(
                arr => arr.length
            );
            const isSame = lengths.every(len => len === lengths[0]);
            if (!isSame) return;

            const formattedData = time.map((time, i) => {
                const newElement = {
                    time: time,
                    open: open[i],
                    close: close[i],
                    high: high[i],
                    low: low[i],
                };
                return newElement;
            });

            setCandleStickData(formattedData);
        });
    }, [ticker, chartScale]);

    return (
        <Flex
            className="flex-col"
            fontSize={{ base: '12px', md: '14px', lg: '16px', xl: '18px' }}
        >
            <Center
                bg="light.navy"
                color="light.white"
                h={{ base: '48px', lg: '60px' }}
                borderBottomColor="light.yellow"
                borderBottomWidth={4}
            >
                <Heading size={{ base: 'md', lg: 'lg' }}>
                    {ticker || 'Watchlist'}
                </Heading>
            </Center>

            <Box
                px={{ base: '16px', lg: '32px', xl: '0' }}
                mx={{ xl: 'auto' }}
                w={{ xl: '1020px' }}
                pt={4}
            >
                <CandleStick
                    data={candlestickData.length > 0 ? candlestickData : []}
                ></CandleStick>
            </Box>
            <Tabs
                variant="unstyled"
                size="md"
                px={{ base: '16px', lg: '32px', xl: '0' }}
                mx={{ xl: 'auto' }}
                w={{ xl: '1020px' }}
                color="light.grey"
            >
                <TabList>
                    <Tab
                        px={0}
                        mx={4}
                        borderBottom="2px"
                        borderBottomColor="light.white"
                        _selected={{
                            color: 'light.blue',
                            borderBottomColor: 'light.blue',
                        }}
                        onClick={() => changeScale('1Y')}
                    >
                        1Y
                    </Tab>
                    <Tab
                        px={0}
                        mx={4}
                        borderBottom="2px"
                        borderBottomColor="light.white"
                        _selected={{
                            color: 'light.blue',
                            borderBottomColor: 'light.blue',
                        }}
                        onClick={() => changeScale('5Y')}
                    >
                        5Y
                    </Tab>
                </TabList>
            </Tabs>

            <Flex
                className="flex-col"
                px={{ base: '16px', lg: '32px', xl: '0' }}
                mx={{ xl: 'auto' }}
                w={{ xl: '1020px' }}
            >
                <FormControl py={4}>
                    <Flex w="100%" gap={4} justifyContent="space-between">
                        <Box flex="1" zIndex={1}>
                            <Select
                                key={listLength}
                                placeholder="Type Symbol"
                                options={symbolOptions.current}
                                isRequired
                                onChange={findTicker}
                            ></Select>
                        </Box>

                        <Center
                            bg="light.black"
                            boxSize="38px"
                            justifyItems="center"
                            alignItems="center"
                            cursor="pointer"
                            borderRadius={4}
                            onClick={addTicker}
                        >
                            <AddIcon color="light.white" />
                        </Center>
                    </Flex>
                    {existing ? (
                        <FormHelperText color="light.red">
                            Already existing!
                        </FormHelperText>
                    ) : (
                        <></>
                    )}
                </FormControl>
            </Flex>

            <Tabs
                isFitted
                variant="enclosed"
                px={{ base: '16px', lg: '32px', xl: '0' }}
                mx={{ xl: 'auto' }}
                w={{ xl: '1020px' }}
                borderBottomColor="light.white"
            >
                <TabList>
                    <Tab
                        borderBottomColor="light.yellow"
                        _selected={{
                            color: 'light.blue',
                            borderColor: 'light.yellow',
                            borderBottomColor: 'light.white',
                        }}
                    >
                        Watchlist
                    </Tab>
                    <Tab
                        borderBottomColor="light.yellow"
                        _selected={{
                            color: 'light.blue',
                            borderColor: 'light.yellow',
                            borderBottomColor: 'light.white',
                        }}
                    >
                        Statistics
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel key={0} p={0} pt={4}>
                        <ObjList
                            key={0}
                            type={'watchlist'}
                            list={watchlist}
                            usd2cad={exRate}
                            changeTicker={changeTicker}
                            deleteTicker={deleteItem}
                        />
                    </TabPanel>
                    <TabPanel key={1} p={0} pt={4}>
                        {ticker ? (
                            <Statistics key={ticker} ticker={ticker} />
                        ) : (
                            <></>
                        )}
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <Box h={48} />
        </Flex>
    );
}

export default Watchlist;
