import React from 'react';
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
import '../styles/global.scss';

function History() {
    return (
        <Flex className="flex-col">
            <Center
                bg="light.navy"
                color="light.white"
                h={12}
                borderBottomColor="light.yellow"
                borderBottomWidth={4}
            >
                <Heading size="md">Transaction History</Heading>
            </Center>
            <Tabs
                isFitted
                variant="enclosed"
                px={4}
                pt={4}
                borderColor="light.yellow"
            >
                <TabList>
                    <Tab
                        _selected={{
                            color: 'light.blue',
                            borderColor: 'light.yellow',
                            borderBottomColor: 'light.white',
                        }}
                    >
                        Trades
                    </Tab>
                    <Tab
                        _selected={{
                            color: 'light.blue',
                            borderColor: 'light.yellow',
                            borderBottomColor: 'light.white',
                        }}
                    >
                        Funding
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel p={0}>one</TabPanel>
                    <TabPanel p={0}></TabPanel>
                </TabPanels>
            </Tabs>
        </Flex>
    );
}

export default History;
