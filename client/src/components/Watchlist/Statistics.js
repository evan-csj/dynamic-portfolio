import React, { useState, useEffect } from 'react';
import {
    getCompanyProfile,
    getEps,
    getTrends,
    getSymbol,
    putSymbolEps,
    putSymbolTrend,
} from '../../global/axios';
import { HStack, Box, Heading, Image } from '@chakra-ui/react';
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
    const [dataEps, setDataEps] = useState(undefined);
    const [dataTrends, setDataTrends] = useState(undefined);

    useEffect(() => {
        if (!props.ticker) return;
        getSymbol(props.ticker).then(response => {
            let { name, exchange, logo, sector, eps, trend } = response.data;
            let companyProfile = {
                name,
                exchange,
                logo,
                sector,
            };

            if (!name || !exchange || !logo || !sector) {
                getCompanyProfile(props.ticker).then(response => {
                    companyProfile = {
                        name: response.data.name,
                        exchange: response.data.name,
                        logo: response.data.logo,
                        sector: response.data.finnhubIndustry,
                    };
                });
            }

            setProfile(companyProfile);

            getEps(props.ticker).then(response => {
                const epsUpdate = response.data;
                let labels = [];
                let actual = [];
                let estimate = [];

                epsUpdate.forEach(item => {
                    labels.push(item.period);
                    actual.push(item.actual);
                    estimate.push(item.estimate);
                });

                const dataEps = {
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

                setDataEps(dataEps);
                const eps2DB = {
                    0: epsUpdate[0],
                    1: epsUpdate[1],
                    2: epsUpdate[2],
                    3: epsUpdate[3],
                };
                putSymbolEps(props.ticker, eps2DB);
            });

            getTrends(props.ticker).then(response => {
                const trendUpdate = response.data;
                let labels = [];
                let strongBuy = [];
                let buy = [];
                let hold = [];
                let sell = [];
                let strongSell = [];

                trendUpdate.forEach(item => {
                    labels.push(item.period);
                    strongBuy.push(item.strongBuy);
                    buy.push(item.buy);
                    hold.push(item.hold);
                    sell.push(item.sell);
                    strongSell.push(item.strongSell);
                });

                const dataTrends = {
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

                setDataTrends(dataTrends);
                const trend2DB = {
                    0: trendUpdate[0],
                    1: trendUpdate[1],
                    2: trendUpdate[2],
                    3: trendUpdate[3],
                };
                putSymbolTrend(props.ticker, trend2DB);
            });
        });
        // eslint-disable-next-line
    }, []);

    if (profile && dataEps && dataTrends) {
        return (
            <Box p={4}>
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
                <Box w="50%" h={props.ww / 3}>
                    <Bar options={optionsEps} data={dataEps} />
                </Box>
                <Box w="50%" h={props.ww / 3}>
                    <Bar options={optionsTrends} data={dataTrends} />
                </Box>
            </Box>
        );
    }
};

export default Statistics;
