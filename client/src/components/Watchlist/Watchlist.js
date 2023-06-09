import React, { useEffect, useState, useRef, useCallback } from 'react';
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
} from '../../global/axios';
import CandleStick from './CandleStick';
import Statistics from './Statistics';
import ObjList from '../ObjList';
import '../../styles/global.scss';
import useWebSocket from 'react-use-websocket';

function Watchlist(props) {
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

    const FINNHUB_KEY = process.env.REACT_APP_FINNHUB_KEY;
    const socketUrl = `wss://ws.finnhub.io?token=${FINNHUB_KEY}`;
    const { sendMessage, lastMessage } = useWebSocket(socketUrl, {
        onOpen: () => console.log('opened'),
        shouldReconnect: closeEvent => true,
    });

    const wsInitial = () => {
        const keyList = Object.keys(watchlist);
        for (const symbol of keyList) {
            sendMessage(JSON.stringify({ type: 'subscribe', symbol: symbol }));
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
                let watchItem = watchlist[keyList[i]];
                const quote = await getLastPrice(keyList[i]);
                const currentPrice = quote.data.c;
                const previousClose = quote.data.pc;
                watchItem.price = currentPrice;
                watchItem.prev_close = previousClose;
                newWatchlist[keyList[i]] = watchItem;
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
            const currentPrice = quote.data.c;
            const previousClose = quote.data.pc;
            let newWatch = {
                id: `${props.userId}-${searchTicker}`,
                user_id: props.userId,
                ticker: searchTicker,
                price: currentPrice,
                prev_close: previousClose,
                currency: 'usd',
            };
            let newWatchlist = { ...watchlist };
            newWatchlist[searchTicker] = newWatch;
            setWatchlist(newWatchlist);
            await postWatchItem(newWatch);
            wsChange('subscribe', searchTicker);
            setListLength(Object.keys(newWatchlist).length);
        }
    };

    const deleteItem = ticker => {
        let newWatchlist = { ...watchlist };
        if (ticker in watchlist) {
            delete newWatchlist[ticker];
            setWatchlist(newWatchlist);
            deleteWatchItem(`${props.userId}-${ticker}`);
            wsChange('unsubscribe', ticker);
        }
        return;
    };

    useEffect(() => {
        getWatchlist(props.userId).then(response => {
            const dataObj = convertArray2Dict(response.data);
            setWatchlist(dataObj);
            setIsWatchlistLoaded(true);
            setTicker(response.data[0].ticker);
        });
    }, [props.userId]);

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
                console.log(symbol, price);
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

            <Tabs
                isFitted
                variant="enclosed"
                px={4}
                pt={4}
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
                    <TabPanel key={0} p={0}>
                        <Flex
                            className="flex-col"
                            px={{ base: '16px', lg: '32px', xl: '0' }}
                            mx={{ xl: 'auto' }}
                            w={{ xl: '1020px' }}
                        >
                            <FormControl py={4}>
                                <Flex
                                    w="100%"
                                    gap={4}
                                    justifyContent="space-between"
                                >
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

                            <ObjList
                                key={0}
                                type={'watchlist'}
                                list={watchlist}
                                usd2cad={exRate}
                                changeTicker={changeTicker}
                                deleteTicker={deleteItem}
                            />
                        </Flex>
                    </TabPanel>
                    <TabPanel key={1} p={0}>
                        <Statistics />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Flex>
    );
}

export default Watchlist;
