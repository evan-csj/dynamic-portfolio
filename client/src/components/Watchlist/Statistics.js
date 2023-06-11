import React, { useState, useEffect } from 'react';
import { getCompanyProfile } from '../../global/axios';
import {
    Grid,
    GridItem,
    VStack,
    HStack,
    Box,
    Heading,
    Stat,
    StatArrow,
    Skeleton,
    Image,
    SkeletonCircle,
} from '@chakra-ui/react';

const Statistics = props => {
    const [profile, setProfile] = useState(undefined);

    useEffect(() => {
        getCompanyProfile(props.ticker).then(response => {
            setProfile(response.data);
        });
    }, []);

    if (profile) {
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
                <Box color="light.grey" pt={2}>{profile.exchange}</Box>
            </Box>
        );
    }
};

export default Statistics;
