import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Skeleton,
} from '@chakra-ui/react';
import ObjList from '../ObjList';
import Portfolio from './Portfolio';
import SkeletonDollar from './SkeletonDollar';
import {
    getUser,
    getLastPrice,
    getCurrency,
    getHoldings,
    getCompanyProfile,
    putSymbolPrice,
    putSymbolInfo,
} from '../../global/axios';
import '../../styles/global.scss';
import dayjs from 'dayjs';

const quotes = [
    {
        statement:
            "The best investment you can make is an investment in yourself. The more you learn, the more you'll earn.",
        name: 'Warren Buffett',
    },
    {
        statement:
            'Be fearful when others are greedy and be greed when others are fearful.',
        name: 'Warren Buffett',
    },
    {
        statement:
            'Wide diversification is only required when investors do not understand what they are doing.',
        name: 'Warren Buffett',
    },
    {
        statement: 'Never invest in a business you cannot understand.',
        name: 'Warren Buffett',
    },
    {
        statement:
            'The key to making money in stocks is not to get scared out of them.',
        name: 'Peter Lynch',
    },
    {
        statement:
            "The basic story remains simple and never ending. Stock aren't lottery tickets. There's a company attached to every share.",
        name: 'Peter Lynch',
    },
    {
        statement: 'Know what you own and know why you own it.',
        name: 'Peter Lynch',
    },
    {
        statement:
            'The big money is not in the buying or selling, but in the waiting.',
        name: 'Charlie Munger',
    },
    {
        statement:
            'Simplicity has a way of improving performance by enabling us to better understand what we are doing.',
        name: 'Charlie Munger',
    },
    {
        statement:
            'Spend each day trying to be a little wise than you were when you wake up.',
        name: 'Charlie Munger',
    },
];

const Profile = props => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [userData, setUserData] = useState(undefined);
    const [holdingList, setHoldingList] = useState({});
    const [isHoldingLoaded, setIsHoldingLoaded] = useState(false);
    const [isPriceLoaded, setIsPriceLoaded] = useState(false);
    const [exRate, setExRate] = useState(0);
    const [accountDetail, setAccountDetail] = useState(undefined);
    const [quoteIndex, setQuoteIndex] = useState(0);
    const { lastMessage, sendMessage, setSubscribe, unsubscribeAll } = props;

    const wsInitial = () => {
        unsubscribeAll();
        const keyList = Object.keys(holdingList);
        setSubscribe(keyList);
        for (const symbol of keyList) {
            sendMessage(JSON.stringify({ type: 'subscribe', symbol: symbol }));
        }
    };

    const updateHoldingList = async () => {
        if (isHoldingLoaded) {
            let newHoldinglist = {};
            const keyList = Object.keys(holdingList);
            for (let i = 0; i < keyList.length; i++) {
                const ticker = keyList[i];
                const holdingItem = holdingList[ticker];
                const diff = dayjs().diff(dayjs(holdingItem.updated_at), 's');

                if (holdingItem.currency === null) {
                    const profile = await getCompanyProfile(ticker);

                    const {
                        name,
                        exchange,
                        finnhubIndustry: sector,
                        logo,
                        currency,
                    } = profile.data;

                    const updateSymbol = {
                        ticker: ticker,
                        name: name,
                        exchange: exchange,
                        sector: sector,
                        logo: logo,
                        currency: currency,
                    };

                    holdingItem.currency = currency;
                    await putSymbolInfo(updateSymbol);
                }

                if (diff > 60 || holdingItem.price === 0) {
                    const quote = await getLastPrice(ticker);
                    const { c: currentPrice, pc: previousClose } = quote.data;
                    holdingItem.price = currentPrice;
                    await putSymbolPrice({
                        symbol: ticker,
                        price: currentPrice,
                        prevClose: previousClose,
                    });
                }

                newHoldinglist[ticker] = holdingItem;
            }
            setHoldingList(newHoldinglist);
            setIsPriceLoaded(true);
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
            if (item.buy_shares - item.sell_shares > 0)
                dict[item.ticker] = item;
        }
        return dict;
    };

    useEffect(() => {
        getCurrency().then(response => {
            setExRate(response.data);
        });
    }, []);

    useEffect(() => {
        const username = sessionStorage.getItem('userId');
        setUserId(username);

        // if (username === null) {
        //     navigate('/');
        // } else {
        //     getUser(username).then(response => {
        //         if (response) {
        //             const { first_name, last_name, cash_cad, cash_usd, dp } =
        //                 response.data;
        //             const user = {
        //                 firstName: first_name,
        //                 lastName: last_name,
        //                 cashCAD: cash_cad,
        //                 cashUSD: cash_usd,
        //                 dp: dp,
        //             };
        //             setUserData(user);
        //         } else {
        //             navigate('/');
        //         }
        //     });

        //     getHoldings(username).then(response => {
        //         const dataObj = convertArray2Dict(response.data);
        //         setHoldingList(dataObj);
        //         setIsHoldingLoaded(true);
        //     });
        // }

        getUser('').then(response => {
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

        getHoldings('evancheng').then(response => {
            const dataObj = convertArray2Dict(response.data);
            setHoldingList(dataObj);
            setIsHoldingLoaded(true);
        });
        // eslint-disable-next-line
    }, [props.toggle]);

    useEffect(() => {
        if (isHoldingLoaded) {
            updateHoldingList();
            wsInitial();
        }
        // eslint-disable-next-line
    }, [isHoldingLoaded]);

    useEffect(() => {
        if (lastMessage !== null) {
            const json = JSON.parse(lastMessage.data);
            const type = json.type;
            if (type === 'trade') {
                const data = json.data;
                const price = data[0].p;
                const symbol = data[0].s;
                updatePrice(symbol, price);
            }
        }
        // eslint-disable-next-line
    }, [lastMessage]);

    useEffect(() => {
        if (exRate !== 0 && userData !== undefined && isPriceLoaded) {
            let equityCAD = 0;
            let equityUSD = 0;
            let equityTotal = 0;
            const USD2CAD = exRate;

            const keyList = Object.keys(holdingList);
            for (let i = 0; i < keyList.length; i++) {
                const holding = holdingList[keyList[i]];
                const currency = holding.currency;
                const shares = holding.buy_shares - holding.sell_shares;
                const price = holding.price;

                if (currency === 'USD') {
                    equityUSD += price * shares;
                }
                if (currency === 'CAD') {
                    equityCAD += price * shares;
                }
                equityTotal += price * shares;
            }

            const result = {
                equityCAD: equityCAD * USD2CAD,
                equityUSD: equityUSD,
                equityTotal: equityTotal * USD2CAD,
                usd2cad: USD2CAD,
            };

            setAccountDetail(result);
        }
    }, [exRate, userData, holdingList, isPriceLoaded]);

    useEffect(() => {
        setQuoteIndex(Math.floor(Math.random() * quotes.length));
    }, []);

    const cashCAD = userData ? userData.cashCAD : 0;
    const cashUSD = userData ? userData.cashUSD : 0;
    const equityCAD = accountDetail ? accountDetail.equityCAD : 0;
    const equityUSD = accountDetail ? accountDetail.equityUSD : 0;
    const equityTotal = accountDetail ? accountDetail.equityTotal : 0;
    const usd2cad = accountDetail ? accountDetail.usd2cad : 1;
    const quote = quotes[quoteIndex];

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
                            mt="8px"
                        >
                            {userData ? (
                                <Flex gap="16px">
                                    <Box>{userData.firstName}</Box>
                                    <Box>{userData.lastName}</Box>
                                </Flex>
                            ) : (
                                <Flex gap="16px">
                                    <Skeleton
                                        w="fit-content"
                                        borderRadius="24px"
                                    >
                                        XXXXX
                                    </Skeleton>
                                    <Skeleton
                                        w="fit-content"
                                        borderRadius="24px"
                                    >
                                        XXXXXXXX
                                    </Skeleton>
                                </Flex>
                            )}
                        </Heading>
                    </Box>
                    <Text color="light.white">{quote.statement}</Text>
                    <Text color="light.white" alignSelf="end" fontWeight="bold">
                        ---- ---- {quote.name}
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
                    pt={{ base: '16px', lg: '32px' }}
                    pb="16px"
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
                                <Th w="10%"></Th>
                                <Th w="30%" isNumeric>
                                    CAD
                                </Th>
                                <Th w="30%" isNumeric>
                                    USD
                                </Th>
                                <Th w="30%" isNumeric>
                                    Total
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody borderColor="light.yellow">
                            <Tr>
                                <Th>Assets</Th>
                                <Td isNumeric>
                                    <SkeletonDollar
                                        condition={accountDetail && userData}
                                        value={equityCAD + cashCAD}
                                    />
                                </Td>
                                <Td isNumeric>
                                    <SkeletonDollar
                                        condition={accountDetail && userData}
                                        value={equityUSD + cashUSD}
                                    />
                                </Td>
                                <Td isNumeric>
                                    <SkeletonDollar
                                        condition={accountDetail && userData}
                                        value={
                                            equityTotal +
                                            cashCAD +
                                            cashUSD * usd2cad
                                        }
                                    />
                                </Td>
                            </Tr>
                            <Tr>
                                <Th>Equity</Th>
                                <Td isNumeric>
                                    <SkeletonDollar
                                        condition={accountDetail}
                                        value={equityCAD}
                                    />
                                </Td>
                                <Td isNumeric>
                                    <SkeletonDollar
                                        condition={accountDetail}
                                        value={equityUSD}
                                    />
                                </Td>
                                <Td isNumeric>
                                    <SkeletonDollar
                                        condition={accountDetail}
                                        value={equityTotal}
                                    />
                                </Td>
                            </Tr>
                            <Tr>
                                <Th>Cash</Th>
                                <Td isNumeric>
                                    <SkeletonDollar
                                        condition={userData}
                                        value={cashCAD}
                                    />
                                </Td>
                                <Td isNumeric>
                                    <SkeletonDollar
                                        condition={userData}
                                        value={cashUSD}
                                    />
                                </Td>
                                <Td isNumeric>
                                    <SkeletonDollar
                                        condition={accountDetail && userData}
                                        value={cashCAD + cashUSD * usd2cad}
                                    />
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
                            usd2cad={accountDetail ? accountDetail.usd2cad : 1}
                        />
                    </TabPanel>
                    <TabPanel p={0}>
                        <Portfolio
                            key={1}
                            user={userData}
                            userId={userId}
                            changePage={props.changePage}
                        />
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <Box h={48} />
        </Flex>
    );
};

export default Profile;
