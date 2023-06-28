import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const [tradingList, setTradingList] = useState([]);
    const [fundingList, setFundingList] = useState([]);

    useEffect(() => {
        props.unsubscribeAll();
        const username = sessionStorage.getItem('userId');

        if (username === null) {
            navigate('/');
        } else {
            getTrading(username).then(response => {
                setTradingList(response.data);
            });
            getFunding(username).then(response => {
                setFundingList(response.data);
            });
        }
        // eslint-disable-next-line
    }, []);

    return (
        <Flex
            className="flex-col"
            fontSize={{ base: '12px', md: '14px', lg: '16px', xl: '18px' }}
        >
            <Center
                bg="light.navy"
                color="light.white"
                h={{ base: '48px', lg: '60px' }}
                borderBottomColor="light.yellow"
                borderBottomWidth={4}
            >
                <Heading size={{ base: 'md', lg: 'lg' }}>
                    Transaction History
                </Heading>
            </Center>
            <Tabs
                isFitted
                variant="enclosed"
                px={{ base: '16px', lg: '32px', xl: '0' }}
                mx={{ xl: 'auto' }}
                w={{ xl: '1020px' }}
                pt={4}
                borderBottomColor="light.white"
            >
                <TabList>
                    <Tab
                        borderBottomColor="light.yellow"
                        _selected={{
                            color: 'light.blue',
                            borderColor: 'light.yellow',
                            borderBottomColor: 'light.white',
                        }}
                    >
                        Trading
                    </Tab>
                    <Tab
                        borderBottomColor="light.yellow"
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
            <Box h={48} />
        </Flex>
    );
}

export default Transaction;
