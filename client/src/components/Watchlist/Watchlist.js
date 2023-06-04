import React, { useEffect, useState, useRef } from 'react';
import Select from 'react-select';
import {
    Heading,
    Flex,
    Box,
    Center,
    Tabs,
    TabList,
    Tab,
    FormControl,
    FormHelperText,
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
import List from '../List';
import '../../styles/global.scss';

function Watchlist(props) {
    const [watchlist, setWatchlist] = useState([]);
    const [isWatchlistLoaded, setIsWatchlistLoaded] = useState(false);
    const [exRate, setExRate] = useState(1);
    const [candlestickData, setCandleStickData] = useState([]);
    const [chartScale, setChartScale] = useState('1Y');
    const [ticker, setTicker] = useState('');
    const [existing, setExising] = useState(false);
    const [searchTicker, setSearchTicker] = useState('');
    const symbolOptions = useRef([]);

    const updateWatchlist = async () => {
        if (watchlist.length > 0) {
            let newWatchlist = [...watchlist];
            for (let i = 0; i < newWatchlist.length; i++) {
                const watchItem = newWatchlist[i];
                const quote = await getLastPrice(watchItem.ticker);
                const currentPrice = quote.data.c;
                watchItem.price = currentPrice;
            }
            setWatchlist(newWatchlist);
        }
    };

    useEffect(() => {
        getWatchlist(props.userId).then(response => {
            setWatchlist(response.data);
            setIsWatchlistLoaded(true);
            setTicker(response.data[0].ticker);
        });
    }, [props.userId]);

    useEffect(() => {
        updateWatchlist();
    }, [isWatchlistLoaded]);

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

    const changeTicker = symbol => {
        setTicker(symbol);
    };

    const changeScale = scale => {
        setChartScale(scale);
    };

    const findTicker = selected => {
        setSearchTicker(selected.value);
        for (let i = 0; i < watchlist.length; i++) {
            if (watchlist[i].ticker === selected.value) {
                setExising(true);
                return;
            }
        }
        setExising(false);
        return;
    };

    const addTicker = async () => {
        if (searchTicker !== '' && !existing) {
            const quote = await getLastPrice(searchTicker);
            const currentPrice = quote.data.c;
            let newItem = {
                id: `${props.userId}-${searchTicker}`,
                user_id: props.userId,
                ticker: searchTicker,
                price: currentPrice,
                currency: 'usd',
            };
            const newWatchlist = [...watchlist, newItem];
            setWatchlist(newWatchlist);
            await postWatchItem(newItem);
            setSearchTicker('');
        }
    };

    const deleteItem = ticker => {
        let newWatchlist = [];
        for (let i = 0; i < watchlist.length; i++) {
            if (watchlist[i].ticker !== ticker) newWatchlist.push(watchlist[i]);
        }
        setWatchlist(newWatchlist);
        deleteWatchItem(`${props.userId}-${ticker}`);
    };

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
                <FormControl key={watchlist} py={4}>
                    <Flex w="100%" gap={4} justifyContent="space-between">
                        <Box flex="1" zIndex={1}>
                            <Select
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

                <List
                    key={0}
                    type={'watchlist'}
                    list={watchlist}
                    usd2cad={exRate}
                    changeTicker={changeTicker}
                    deleteTicker={deleteItem}
                />
            </Flex>

            {/* <Tabs isFitted variant="enclosed" px={4} pt={4} borderBottomColor="light.white">
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
                        Summary
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel p={0}>
                        <List
                            key={0}
                            type={'watchlist'}
                            list={watchlistRT ? watchlistRT.list : watchlist}
                            usd2cad={watchlistRT ? watchlistRT.usd2cad : 1}
                            changeTicker={changeTicker}
                        />
                    </TabPanel>
                    <TabPanel p={0}></TabPanel>
                </TabPanels>
            </Tabs> */}
        </Flex>
    );
}

export default Watchlist;
