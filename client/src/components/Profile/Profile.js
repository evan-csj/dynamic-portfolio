import React, { useEffect, useState, useCallback } from 'react';
import {
    Flex,
    Box,
    Heading,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from '@chakra-ui/react';
import ObjList from '../ObjList';
import Portfolio from './Portfolio';
import {
    getUser,
    getLastPrice,
    getCurrency,
    getHoldings,
} from '../../global/axios';
import '../../styles/global.scss';
import useWebSocket from 'react-use-websocket';

function Profile(props) {
    const [userData, setUserData] = useState(undefined);
    const [holdingList, setHoldingList] = useState({});
    const [isHoldingLoaded, setIsHoldingLoaded] = useState(false);
    const [accountDetail, setAccountDetail] = useState(undefined);

    const FINNHUB_KEY = process.env.REACT_APP_FINNHUB_KEY;
    const socketUrl = `wss://ws.finnhub.io?token=${FINNHUB_KEY}`;
    const { sendMessage, lastMessage } = useWebSocket(socketUrl, {
        onOpen: () => console.log('opened'),
        shouldReconnect: closeEvent => true,
    });

    const wsInitial = () => {
        const keyList = Object.keys(holdingList);
        console.log(keyList);
        for (const symbol of keyList) {
            sendMessage(JSON.stringify({ type: 'subscribe', symbol: symbol }));
        }
    };

    const updateHoldingList = async () => {
        if (isHoldingLoaded) {
            let newHoldinglist = {};
            const keyList = Object.keys(holdingList);
            for (let i = 0; i < keyList.length; i++) {
                let holdingItem = holdingList[keyList[i]];
                const quote = await getLastPrice(keyList[i]);
                const currentPrice = quote.data.c;
                holdingItem.price = currentPrice;
                newHoldinglist[keyList[i]] = holdingItem;
            }
            setHoldingList(newHoldinglist);
        }
    };

    const updatePrice = (symbol, price) => {
        let newHoldinglist = { ...holdingList };
        if (symbol in holdingList) {
            newHoldinglist[symbol].price = price;
        }
        setHoldingList(newHoldinglist);
    };

    const convertArray2Dict = array => {
        let dict = {};
        for (const item of array) {
            dict[item.ticker] = item;
        }
        return dict;
    };

    useEffect(() => {
        getUser(props.userId).then(response => {
            const { first_name, last_name, cash_cad, cash_usd, dp } =
                response.data;
            const user = {
                firstName: first_name,
                lastName: last_name,
                cashCAD: cash_cad,
                cashUSD: cash_usd,
                dp: dp,
            };
            setUserData(user);
        });
        getHoldings(props.userId).then(response => {
            const dataObj = convertArray2Dict(response.data);
            setHoldingList(dataObj);
            setIsHoldingLoaded(true);
        });
    }, [props.userId]);

    useEffect(() => {
        if (isHoldingLoaded) {
            updateHoldingList();
            wsInitial();
        }
    }, [isHoldingLoaded]);

    useEffect(() => {
        if (lastMessage !== null) {
            const json = JSON.parse(lastMessage.data);
            const type = json.type;
            if (type === 'trade') {
                const data = json.data;
                const price = data[0].p;
                const symbol = data[0].s;
                console.log(symbol, price);
                updatePrice(symbol, price);
            }
        }
    }, [lastMessage]);

    // useEffect(() => {
    //     getUser(props.userId).then(response => {
    //         const { first_name, last_name, cash_cad, cash_usd, dp } =
    //             response.data;
    //         const user = {
    //             firstName: first_name,
    //             lastName: last_name,
    //             cashCAD: cash_cad,
    //             cashUSD: cash_usd,
    //             dp: dp,
    //         };
    //         setUserData(user);
    //     });
    //     getHoldings(props.userId).then(response => {
    //         setHoldingList(response.data);
    //     });
    //     const exchangeRate = getCurrency();

    //     Promise.allSettled([holdingRTPrice, exchangeRate]).then(response => {
    //         const holdingRTPriceRes = response[0].value.data;
    //         const USD2CAD = response[1].value.data;

    //         let equityCAD = 0;
    //         let equityUSD = 0;
    //         let equityTotal = 0;
    //         holdingRTPriceRes.forEach(item => {
    //             const value =
    //                 item.last_price * (item.buy_shares - item.sell_shares);
    //             if (item.currency === 'cad') {
    //                 equityCAD += value;
    //             } else if (item.currency === 'usd') {
    //                 equityUSD += value;
    //             }
    //             equityTotal += value;
    //         });

    //         const result = {
    //             equityCAD: equityCAD * USD2CAD,
    //             equityUSD: equityUSD,
    //             equityTotal: equityTotal * USD2CAD,
    //             usd2cad: USD2CAD,
    //             holdingList: holdingRTPriceRes,
    //         };

    //         setAccountDetail(result);
    //     });
    // }, [props.userId]);

    if (true) {
        return (
            <Flex
                className="flex-col"
                fontSize={{ base: '12px', md: '14px', lg: '16px', xl: '18px' }}
            >
                {/* Profile Header in Mobile */}
                <Flex
                    bg="light.navy"
                    px={{ base: '16px', lg: '32px', xl: '0' }}
                    pt={8}
                    pb={4}
                    borderBottomColor="light.yellow"
                    borderBottomWidth={{ base: '4px', md: '8px' }}
                    gap={4}
                    justifyContent="space-between"
                    className="flex-col"
                >
                    <Flex
                        className="flex-col"
                        gap={4}
                        mx={{ xl: 'auto' }}
                        w={{ xl: '1020px' }}
                    >
                        <Box>
                            <Heading
                                color="light.white"
                                size={{ base: 'md', md: 'lg', lg: 'xl' }}
                            >
                                Welcome!
                            </Heading>
                            <Heading
                                color="light.yellow"
                                size={{ base: 'md', md: 'lg', lg: 'xl' }}
                            >
                                {userData ? userData.firstName : 'FirstName'}{' '}
                                {userData ? userData.lastName : 'LastName'}
                            </Heading>
                        </Box>
                        <Text color="light.white">
                            "Be fearful when others are greedy and be greed when
                            others are fearful."
                        </Text>
                        <Text color="light.white" alignSelf="end">
                            -- -- Warren Buffett
                        </Text>
                    </Flex>
                </Flex>

                {/* Account Details */}
                <Flex
                    className="flex-col"
                    px={{ base: '16px', lg: '32px', xl: '0' }}
                    mx={{ xl: 'auto' }}
                    w={{ xl: '1020px' }}
                >
                    <Heading
                        py={4}
                        color="light.black"
                        size={{ base: 'sm', md: 'md', lg: 'lg' }}
                    >
                        Account Details
                    </Heading>
                    <TableContainer borderColor="light.yellow">
                        <Table
                            size="sm"
                            variant="simple"
                            className="table-user"
                            borderColor="light.yellow"
                        >
                            <Thead borderColor="light.yellow">
                                <Tr borderColor="light.yellow">
                                    <Th></Th>
                                    <Th isNumeric>CAD</Th>
                                    <Th isNumeric>USD</Th>
                                    <Th isNumeric>Total</Th>
                                </Tr>
                            </Thead>
                            <Tbody borderColor="light.yellow">
                                <Tr>
                                    <Th>Assets</Th>
                                    <Td isNumeric>
                                        $
                                        {accountDetail && userData
                                            ? (
                                                  accountDetail.equityCAD +
                                                  userData.cashCAD
                                              ).toFixed(2)
                                            : '0.00'}
                                    </Td>
                                    <Td isNumeric>
                                        $
                                        {accountDetail && userData
                                            ? (
                                                  accountDetail.equityUSD +
                                                  userData.cashUSD
                                              ).toFixed(2)
                                            : '0.00'}
                                    </Td>
                                    <Td isNumeric>
                                        $
                                        {accountDetail && userData
                                            ? (
                                                  accountDetail.equityTotal +
                                                  userData.cashCAD +
                                                  userData.cashUSD *
                                                      accountDetail.usd2cad
                                              ).toFixed(2)
                                            : '0.00'}
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Th>Equity</Th>
                                    <Td isNumeric>
                                        $
                                        {accountDetail
                                            ? accountDetail.equityCAD.toFixed(2)
                                            : '0.00'}
                                    </Td>
                                    <Td isNumeric>
                                        $
                                        {accountDetail
                                            ? accountDetail.equityUSD.toFixed(2)
                                            : '0.00'}
                                    </Td>
                                    <Td isNumeric>
                                        $
                                        {accountDetail
                                            ? accountDetail.equityTotal.toFixed(
                                                  2
                                              )
                                            : '0.00'}
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Th>Cash</Th>
                                    <Td isNumeric>
                                        $
                                        {userData
                                            ? userData.cashCAD.toFixed(2)
                                            : '0.00'}
                                    </Td>
                                    <Td isNumeric>
                                        $
                                        {userData
                                            ? userData.cashUSD.toFixed(2)
                                            : '0.00'}
                                    </Td>
                                    <Td isNumeric>
                                        $
                                        {accountDetail && userData
                                            ? (
                                                  userData.cashCAD +
                                                  userData.cashUSD *
                                                      accountDetail.usd2cad
                                              ).toFixed(2)
                                            : '0.00'}
                                    </Td>
                                </Tr>
                                {/* <Tr>
                                    <Th>Gain/Loss</Th>
                                    <Td isNumeric>CAD</Td>
                                    <Td isNumeric>USD</Td>
                                    <Td isNumeric>Total</Td>
                                </Tr> */}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Flex>

                {/* Holdings */}
                <Tabs
                    isFitted
                    variant="enclosed"
                    px={{ base: '16px', lg: '32px', xl: '0' }}
                    mx={{ xl: 'auto' }}
                    w={{ xl: '1020px' }}
                    pt={8}
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
                            Holdings
                        </Tab>
                        <Tab
                            borderBottomColor="light.yellow"
                            _selected={{
                                color: 'light.blue',
                                borderColor: 'light.yellow',
                                borderBottomColor: 'light.white',
                            }}
                        >
                            Portfolio
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel p={0}>
                            <ObjList
                                key={0}
                                type={'holding'}
                                list={holdingList}
                                usd2cad={
                                    accountDetail ? accountDetail.usd2cad : 1
                                }
                            />
                        </TabPanel>
                        <TabPanel p={0}>
                            <Portfolio
                                key={1}
                                user={userData}
                                userId={props.userId}
                            />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
                <Box h={20} />
            </Flex>
        );
    }
}

export default Profile;
