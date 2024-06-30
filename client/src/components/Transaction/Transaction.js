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
    Text,
    Tag,
    Radio,
    RadioGroup,
} from '@chakra-ui/react';
import { getTrading, getFunding } from '../../global/axios';
import List from '../List';
import '../../styles/global.scss';
import dayjs from 'dayjs';

const Transaction = props => {
    const navigate = useNavigate();
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [tradingList, setTradingList] = useState([]);
    const [fundingList, setFundingList] = useState([]);
    const [checkedItems, setCheckedItems] = useState([true, true, true, true]);
    const [timeRange, setTimeRange] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const allChecked = checkedItems.every(Boolean);
    const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

    const handleResize = () => {
        setWindowHeight(window.innerHeight);
    };

    useEffect(() => {
        props.unsubscribeAll();
        const userIdSession = sessionStorage.getItem('userId');
        const username = userIdSession ?? '';
        const tradingType =
            checkedItems[0] && checkedItems[1]
                ? 'all'
                : checkedItems[0]
                ? 'buy'
                : checkedItems[1]
                ? 'sell'
                : '';

        const fundingType =
            checkedItems[2] && checkedItems[3]
                ? 'all'
                : checkedItems[2]
                ? 'deposit'
                : checkedItems[3]
                ? 'withdraw'
                : '';

        getTrading(username, tradingType, startTime, endTime).then(response => {
            if (response.status === 200) {
                setTradingList(response.data);
            } else {
                navigate('/');
            }
        });

        getFunding(username, fundingType, startTime, endTime).then(response => {
            if (response.status === 200) {
                setFundingList(response.data);
            } else {
                navigate('/');
            }
        });
        // eslint-disable-next-line
    }, [props.toggle, checkedItems, startTime]);

    useEffect(() => {
        const currentMoment = dayjs();
        const dayOfWeek = currentMoment.day();
        const timeFrame = Number(timeRange);
        if (timeFrame === 0) {
            setStartTime('');
        } else {
            setStartTime(dayjs().day(dayOfWeek - timeFrame));
        }
        setEndTime(dayjs());
    }, [timeRange]);

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
                <Heading size={{ base: 'md', lg: 'lg' }} userSelect="none">
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
                p={{ base: '16px', lg: '32px' }}
            >
                <Box
                    w="200px"
                    minH={windowHeight - 172}
                    borderRightColor="light.grey"
                    borderRightWidth="1px"
                >
                    <Heading size="md" pb={4} userSelect="none">
                        Type
                    </Heading>
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
                    <Heading size="md" pb={4} pt={8} userSelect="none">
                        Time Frame
                    </Heading>
                    <RadioGroup onChange={setTimeRange} value={timeRange}>
                        <Flex direction="column">
                            <Radio value="">All</Radio>
                            <Radio value="7">Last week</Radio>
                            <Radio value="30">Last 30 days</Radio>
                            <Radio value="60">Last 60 days</Radio>
                            <Radio value="90">Last 90 days</Radio>
                        </Flex>
                    </RadioGroup>
                </Box>
                <Flex direction="column" gap={8} flex={1} pl={8}>
                    {tradingList.length > 0 ? (
                        <Box>
                            <Tag
                                size="lg"
                                variant="outline"
                                color="light.navy"
                                userSelect="none"
                            >
                                Trading
                            </Tag>
                            <List key={0} type={'trading'} list={tradingList} />
                        </Box>
                    ) : (
                        <></>
                    )}

                    {fundingList.length > 0 ? (
                        <Box>
                            <Tag
                                size="lg"
                                variant="outline"
                                color="light.navy"
                                userSelect="none"
                            >
                                Funding
                            </Tag>
                            <List key={1} type={'funding'} list={fundingList} />
                        </Box>
                    ) : (
                        <></>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Transaction;
