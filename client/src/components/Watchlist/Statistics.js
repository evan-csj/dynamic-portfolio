import React, { useState, useEffect } from 'react';
import {
    getCompanyProfile,
    getEps,
    getTrends,
    getSymbol,
    putSymbolEps,
    putSymbolTrend,
} from '../../global/axios';
import { HStack, Box, Heading, Image, Flex } from '@chakra-ui/react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import dayjs from 'dayjs';
import { Bar } from 'react-chartjs-2';
import '../../styles/global.scss';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const optionsEps = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
        },
        title: {
            display: true,
            text: 'Earning per Share',
        },
    },
};

const optionsTrends = {
    plugins: {
        legend: {
            position: 'bottom',
        },
        title: {
            display: true,
            text: 'Recommendation Trends',
        },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            stacked: true,
        },
        y: {
            stacked: true,
        },
    },
};

const Statistics = props => {
    const [profile, setProfile] = useState(undefined);
    const [epsChart, setEpsChart] = useState(undefined);
    const [trendChart, setTrendChart] = useState(undefined);

    const updateEps = async epsInDB => {
        const lastEpsPeriod = epsInDB[0]?.period || '1970-01-01';
        const diffEpsPeriod = dayjs().diff(lastEpsPeriod, 'month', true);
        let labels = [];
        let actual = [];
        let estimate = [];
        let epsUpdate = epsInDB;

        if (diffEpsPeriod > 3.5) {
            const res = await getEps(props.ticker);
            epsUpdate = res.data;

            const eps2DB = {
                0: epsUpdate[0],
                1: epsUpdate[1],
                2: epsUpdate[2],
                3: epsUpdate[3],
            };

            await putSymbolEps(props.ticker, eps2DB);
        }

        epsUpdate.forEach(item => {
            labels.push(item.period);
            actual.push(item.actual);
            estimate.push(item.estimate);
        });

        const chartData = {
            labels,
            datasets: [
                {
                    label: 'Estimate',
                    data: estimate,
                    backgroundColor: '#0b409c',
                },
                {
                    label: 'Actual',
                    data: actual,
                    backgroundColor: '#ffce63',
                },
            ],
        };

        setEpsChart(chartData);
    };

    const updateTrend = async trendInDB => {
        const lastTrendPeriod = trendInDB[0]?.period || '1970-01-01';
        const diffTrendPeriod = dayjs().diff(lastTrendPeriod, 'month', true);
        let labels = [];
        let strongBuy = [];
        let buy = [];
        let hold = [];
        let sell = [];
        let strongSell = [];
        let trendUpdate = trendInDB;
        if (diffTrendPeriod > 1.5) {
            const res = await getTrends(props.ticker);
            trendUpdate = res.data;

            const trend2DB = {
                0: trendUpdate[0],
                1: trendUpdate[1],
                2: trendUpdate[2],
                3: trendUpdate[3],
            };
            await putSymbolTrend(props.ticker, trend2DB);
        }

        trendUpdate.forEach(item => {
            labels.push(item.period);
            strongBuy.push(item.strongBuy);
            buy.push(item.buy);
            hold.push(item.hold);
            sell.push(item.sell);
            strongSell.push(item.strongSell);
        });

        const chartData = {
            labels,
            datasets: [
                {
                    label: 'Strong Sell',
                    data: strongSell,
                    backgroundColor: '#850000',
                },
                {
                    label: 'Sell',
                    data: sell,
                    backgroundColor: '#FF5F5F',
                },
                {
                    label: 'Hold',
                    data: hold,
                    backgroundColor: '#FFCE63',
                },
                {
                    label: 'Buy',
                    data: buy,
                    backgroundColor: '#0B8457',
                },
                {
                    label: 'Strong Buy',
                    data: strongBuy,
                    backgroundColor: '#183A1D',
                },
            ],
        };

        setTrendChart(chartData);
    };

    const fetchCompanyData = async () => {
        try {
            const response = await getSymbol(props.ticker);
            let { name, exchange, logo, sector, eps, trend } = response.data;

            let companyProfile = {
                name,
                exchange,
                logo,
                sector,
            };

            if (!name || !exchange || !logo || !sector) {
                const profileResponse = await getCompanyProfile(props.ticker);
                if (profileResponse.status === 200) {
                    companyProfile = {
                        name: profileResponse.data.name,
                        exchange: profileResponse.data.name,
                        logo: profileResponse.data.logo,
                        sector: profileResponse.data.finnhubIndustry,
                    };
                }
            }

            const epsArray = Object.values(eps);
            const trendArray = Object.values(trend);

            setProfile(companyProfile);
            await updateEps(epsArray);
            await updateTrend(trendArray);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (!props.ticker) return;
        fetchCompanyData();
    }, []);

    return (
        <Box p={4}>
            {profile && (
                <>
                    <HStack>
                        <Image
                            borderRadius="full"
                            boxSize="50px"
                            src={profile.logo}
                            alt={props.ticker}
                        />
                        <Heading>{profile.name}</Heading>
                    </HStack>
                    <Box color="light.grey" pt={2}>
                        {profile.exchange}
                    </Box>
                </>
            )}
            <Flex
                direction={{ base: 'column', lg: 'row' }}
                justifyContent="center"
                gap={6}
            >
                {epsChart && (
                    <Box w={{ base: '100%', lg: '45%' }} h={props.ww / 3}>
                        <Bar options={optionsEps} data={epsChart} />
                    </Box>
                )}

                {trendChart && (
                    <Box w={{ base: '100%', lg: '45%' }} h={props.ww / 3}>
                        <Bar options={optionsTrends} data={trendChart} />
                    </Box>
                )}
            </Flex>
        </Box>
    );
};

export default Statistics;
