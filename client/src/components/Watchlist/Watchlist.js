import React, { useEffect, useState } from 'react';
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
} from '@chakra-ui/react';
import { getWatchlist, getPriceHistory, getRTWatchlist, getCurrency } from '../../global/axios';
import CandleStick from './CandleStick';
import List from '../List';
import '../../styles/global.scss';

function Watchlist(props) {
    const [watchlist, setWatchlist] = useState([]);
    const [watchlistRT, setWatchlistRT] = useState(undefined);
    const [candlestickData, setCandleStickData] = useState([]);
    const [chartScale, setChartScale] = useState('1Y');
    const [ticker, setTicker] = useState('');

    useEffect(() => {
        getWatchlist(props.userId).then(response => {
            setWatchlist(response.data);
            setTicker(response.data[0].ticker)
        });

        const watchlist = getRTWatchlist(props.userId);
        const exchangeRate = getCurrency();

        Promise.allSettled([watchlist, exchangeRate]).then(response => {
            const watchlistRes = response[0].value.data;
            const USD2CAD = response[1].value.data;

            setWatchlistRT({
                list: watchlistRes,
                usd2cad: USD2CAD,
            });
        });
    }, [props.userId]);

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

            <Tabs isFitted variant="enclosed" px={4} pt={4} borderColor="light.yellow">
                <TabList>
                    <Tab
                        _selected={{
                            color: 'light.blue',
                            borderColor: 'light.yellow',
                            borderBottomColor: 'light.white',
                        }}
                    >
                        Watchlist
                    </Tab>
                    <Tab
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
            </Tabs>
        </Flex>
    );
}

export default Watchlist;
