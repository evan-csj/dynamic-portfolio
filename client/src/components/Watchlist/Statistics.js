import React, { useState, useEffect } from 'react';
import { getCompanyProfile, getEps } from '../../global/axios';
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

const options = {
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

const Statistics = props => {
    const [profile, setProfile] = useState(undefined);
    const [data, setData] = useState(undefined);

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

            const data = {
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

            setData(data);
        });
        // eslint-disable-next-line
    }, [profile]);

    if (profile && data) {
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
                <Box>
                    <Bar options={options} data={data} />
                </Box>
            </Box>
        );
    }
};

export default Statistics;
