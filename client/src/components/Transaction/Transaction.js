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
import { getTrading, getFunding } from '../../global/axios';
import List from '../List';
import '../../styles/global.scss';

function Transaction(props) {
    const [tradingList, setTradingList] = useState([]);
    const [fundingList, setFundingList] = useState([]);

    useEffect(() => {
        getTrading(props.userId).then(response => {
            setTradingList(response.data);
        });
        getFunding(props.userId).then(response => {
            setFundingList(response.data);
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
                        Trading
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
                    <TabPanel p={0}>
                        <List key={0} type={'trading'} list={tradingList} />
                    </TabPanel>
                    <TabPanel p={0}>
                        <List key={1} type={'funding'} list={fundingList} />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Flex>
    );
}

export default Transaction;
