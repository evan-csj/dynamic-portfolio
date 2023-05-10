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
import { getWatchlist, getPriceHistory } from '../../global/axios';
import '../../styles/global.scss';

function Watchlist(props) {
    const [watchlist, setWatchlist] = useState([]);
    useEffect(() => {
        getWatchlist(props.userId).then(response => {
            setWatchlist(response.data);
        });
    }, [props.userId]);

    useEffect(() => {
        getPriceHistory('AAPL').then(response => {
            console.log(response.data);
        });
    }, []);

    return (
        <Flex className="flex-col">
            <Center
                bg="light.navy"
                color="light.white"
                h={12}
                borderBottomColor="light.yellow"
                borderBottomWidth={4}
            >
                <Heading size="md">Watchlist</Heading>
            </Center>
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
                    <TabPanel p={0}></TabPanel>
                    <TabPanel p={0}></TabPanel>
                </TabPanels>
            </Tabs>
        </Flex>
    );
}

export default Watchlist;
