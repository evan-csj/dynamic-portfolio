import React, { useState, useEffect } from 'react';
import { getCompanyProfile, getEps, getTrends } from '../../global/axios';
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
        getCompanyProfile(props.ticker).then(response => {
            setProfile(response.data);
        });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!profile) return;
        getEps(props.ticker).then(response => {
            const eps = response.data;
            let labels = [];
            let actual = [];
            let estimate = [];

            eps.forEach(item => {
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
        });

        getTrends(props.ticker).then(response => {
            const trends = response.data;
            let labels = [];
            let strongBuy = [];
            let buy = [];
            let hold = [];
            let sell = [];
            let strongSell = [];

            trends.forEach(item => {
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
        });
        // eslint-disable-next-line
    }, [profile]);

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
                <Bar options={optionsEps} data={dataEps} />
                <Bar options={optionsTrends} data={dataTrends} />
            </Box>
        );
    }
};

export default Statistics;
