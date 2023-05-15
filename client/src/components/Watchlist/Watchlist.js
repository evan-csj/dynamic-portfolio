import React, { useEffect, useState, useRef } from 'react';
import Select from 'react-select';
import {
    Heading,
    Flex,
    Box,
    Center,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    FormControl,
    FormHelperText,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import {
    getWatchlist,
    getPriceHistory,
    getRTWatchlist,
    getCurrency,
    getSymbols,
    getRTPrice,
    postWatchItem,
    deleteWatchItem,
} from '../../global/axios';
import CandleStick from './CandleStick';
import List from '../List';
import '../../styles/global.scss';

function Watchlist(props) {
    const [watchlist, setWatchlist] = useState([]);
    const [watchlistRT, setWatchlistRT] = useState([]);
    const [exRate, setExRate] = useState(0);
    const [candlestickData, setCandleStickData] = useState([]);
    const [chartScale, setChartScale] = useState('1Y');
    const [ticker, setTicker] = useState('');
    const [existing, setExising] = useState(false);
    const [searchTicker, setSearchTicker] = useState('');
    const symbolOptions = useRef([]);

    useEffect(() => {
        getWatchlist(props.userId).then(response => {
            setWatchlist(response.data);
            setTicker(response.data[0].ticker);
        });

        const watchlist = getRTWatchlist(props.userId);
        const exchangeRate = getCurrency();

        Promise.allSettled([watchlist, exchangeRate]).then(response => {
            const watchlistRes = response[0].value.data;
            const USD2CAD = response[1].value.data;

            setWatchlistRT(watchlistRes);
            setExRate(USD2CAD);
        });
    }, [props.userId]);

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
            const { c: close, h: high, l: low, o: open, t: time, v: volume } = response.data;
            const lengths = [time, close, high, low, open, volume].map(arr => arr.length);
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
        for (let i = 0; i < watchlistRT.length; i++) {
            if (watchlistRT[i].ticker === selected.value) {
                setExising(true);
                return;
            }
        }
        setExising(false);
        return;
    };

    const addTicker = async () => {
        if (searchTicker !== '' && !existing) {
            const response = await getRTPrice(searchTicker);
            const priceRT = response.data.price;
            let newItem = {
                id: `${props.userId}-${searchTicker}`,
                user_id: props.userId,
                ticker: searchTicker,
                price: priceRT,
                currency: 'usd',
            };
            const newWatchlistRT = [...watchlistRT, newItem];
            setWatchlistRT(newWatchlistRT);
            await postWatchItem(newItem);
            setSearchTicker('');
        }
    };

    const deleteItem = ticker => {
        let newWatchlistRT = [];
        for (let i = 0; i < watchlistRT.length; i++) {
            if (watchlistRT[i].ticker !== ticker) newWatchlistRT.push(watchlistRT[i]);
        }
        setWatchlistRT(newWatchlistRT);
        deleteWatchItem(`${props.userId}-${ticker}`);
    };

    return (
        <Flex className="flex-col">
            <Center
                bg="light.navy"
                color="light.white"
                h={12}
                borderBottomColor="light.yellow"
                borderBottomWidth={4}
            >
                <Heading size="md">{ticker || 'Watchlist'}</Heading>
            </Center>

            <Box px={4} pt={4}>
                <CandleStick data={candlestickData.length > 0 ? candlestickData : []}></CandleStick>
            </Box>
            <Tabs variant="unstyled" size="md" px={4} w="fit-content" color="light.grey">
                <TabList>
                    <Tab
                        px={0}
                        mx={4}
                        borderBottom="2px"
                        borderBottomColor="light.white"
                        _selected={{ color: 'light.blue', borderBottomColor: 'light.blue' }}
                        onClick={() => changeScale('1Y')}
                    >
                        1Y
                    </Tab>
                    <Tab
                        px={0}
                        mx={4}
                        borderBottom="2px"
                        borderBottomColor="light.white"
                        _selected={{ color: 'light.blue', borderBottomColor: 'light.blue' }}
                        onClick={() => changeScale('5Y')}
                    >
                        5Y
                    </Tab>
                </TabList>
            </Tabs>

            <Flex className="flex-col" px={4} pt={4}>
                <FormControl key={watchlistRT}>
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
                        <FormHelperText color="light.red">Already existing!</FormHelperText>
                    ) : (
                        <></>
                    )}
                </FormControl>

                <List
                    key={0}
                    type={'watchlist'}
                    list={watchlistRT ? watchlistRT : watchlist}
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
