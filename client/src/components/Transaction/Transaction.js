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
    Checkbox,
} from '@chakra-ui/react';
import { getTrading, getFunding } from '../../global/axios';
import List from '../List';
import '../../styles/global.scss';

const Transaction = props => {
    const navigate = useNavigate();
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [tradingList, setTradingList] = useState([]);
    const [fundingList, setFundingList] = useState([]);
    const [checkedItems, setCheckedItems] = useState([true, true, true, true]);

    const allChecked = checkedItems.every(Boolean);
    const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

    const handleResize = () => {
        setWindowHeight(window.innerHeight);
    };

    useEffect(() => {
        props.unsubscribeAll();
        const userIdSession = sessionStorage.getItem('userId');
        const username = userIdSession ?? '';

        getTrading(username).then(response => {
            if (response.status === 200) {
                setTradingList(response.data);
            } else {
                navigate('/');
            }
        });

        getFunding(username).then(response => {
            if (response.status === 200) {
                setFundingList(response.data);
            } else {
                navigate('/');
            }
        });
        // eslint-disable-next-line
    }, [props.toggle]);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <Flex
            direction="column"
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
                display={{ base: 'block', xl: 'none' }}
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

            <Flex
                display={{ base: 'none', xl: 'flex' }}
                justifyContent="space-between"
                px={{ base: '16px', lg: '32px' }}
                pt={8}
            >
                <Box
                    w="200px"
                    minH={windowHeight - 172}
                    borderRightColor="light.grey"
                    borderRightWidth="1px"
                >
                    <Checkbox
                        isChecked={allChecked}
                        isIndeterminate={isIndeterminate}
                        onChange={e =>
                            setCheckedItems([
                                e.target.checked,
                                e.target.checked,
                                e.target.checked,
                                e.target.checked,
                            ])
                        }
                    >
                        All
                    </Checkbox>
                    <Flex pl={6} direction="column">
                        <Checkbox
                            isChecked={checkedItems[0]}
                            onChange={e => {
                                setCheckedItems([
                                    e.target.checked,
                                    checkedItems[1],
                                    checkedItems[2],
                                    checkedItems[3],
                                ]);
                            }}
                        >
                            Buy
                        </Checkbox>
                        <Checkbox
                            isChecked={checkedItems[1]}
                            onChange={e => {
                                setCheckedItems([
                                    checkedItems[0],
                                    e.target.checked,
                                    checkedItems[2],
                                    checkedItems[3],
                                ]);
                            }}
                        >
                            Sell
                        </Checkbox>
                        <Checkbox
                            isChecked={checkedItems[2]}
                            onChange={e => {
                                setCheckedItems([
                                    checkedItems[0],
                                    checkedItems[1],
                                    e.target.checked,
                                    checkedItems[3],
                                ]);
                            }}
                        >
                            Deposit
                        </Checkbox>
                        <Checkbox
                            isChecked={checkedItems[3]}
                            onChange={e => {
                                setCheckedItems([
                                    checkedItems[0],
                                    checkedItems[1],
                                    checkedItems[2],
                                    e.target.checked,
                                ]);
                            }}
                        >
                            Withdraw
                        </Checkbox>
                    </Flex>
                </Box>
                <Box flex={1} pl={8}>
                    <List key={0} type={'trading'} list={tradingList} />
                </Box>
            </Flex>
        </Flex>
    );
};

export default Transaction;
