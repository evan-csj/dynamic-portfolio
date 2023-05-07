import React, { useEffect, useState } from 'react';
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
import HoldingList from './HoldingList';
import { getUser, getHoldingRTPrice, getHoldings } from '../../global/axios';
import '../../styles/global.scss';

function Profile(props) {
    const [accountDetail, setAccountDetail] = useState(undefined);

    useEffect(() => {
        const userData = getUser(props.userId);
        const userHoldings = getHoldings(props.userId);
        const holdingRTPrice = getHoldingRTPrice(props.userId);

        Promise.allSettled([userData, userHoldings, holdingRTPrice]).then(
            response => {
                const userDataRes = response[0].value.data;
                const userHoldingRes = response[1].value.data;
                const holdingRTPriceRes = response[2].value.data;

                const ratio = holdingRTPriceRes['USD/CAD'].price;
                
                const cashTotal =
                    userDataRes.cash_cad + userDataRes.cash_usd / ratio;

                let equityCAD = 0;
                let equityUSD = 0;
                let equityTotal = 0;
                userHoldingRes.forEach(item => {
                    const value =
                        holdingRTPriceRes[item.ticker].price *
                        (item.buy_shares - item.sell_shares);
                    if (item.currency === 'cad') {
                        equityCAD += value;
                    } else if (item.currency === 'usd') {
                        equityUSD += value;
                    }
                    equityTotal += value;
                });

                const result = {
                    firstName: userDataRes.first_name,
                    lastName: userDataRes.last_name,
                    cashCAD: userDataRes.cash_cad,
                    cashUSD: userDataRes.cash_usd,
                    cashTotal: cashTotal,
                    equityCAD: equityCAD * ratio,
                    equityUSD: equityUSD,
                    equityTotal: equityTotal * ratio,
                };

                setAccountDetail(result);
            }
        );
    }, [props.userId]);

    if (accountDetail !== undefined) {
        return (
            <Flex className="flex-col">
                {/* Profile Header in Mobile */}
                <Flex
                    bg="light.navy"
                    px={4}
                    pt={8}
                    pb={4}
                    borderBottomColor="light.yellow"
                    borderBottomWidth="4px"
                    gap={4}
                    justifyContent="space-between"
                    className="flex-col"
                >
                    <Box>
                        <Heading color="light.white" size="xl">
                            Welcome!
                        </Heading>
                        <Heading color="light.yellow" size="lg">
                            {accountDetail.firstName} {accountDetail.lastName}
                        </Heading>
                    </Box>

                    <Flex className="flex-col">
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
                <Flex className="flex-col">
                    <Heading px={4} py={4} color="light.black">
                        Account Details
                    </Heading>
                    <TableContainer
                        px={{ base: '4' }}
                        borderColor="light.yellow"
                    >
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
                                        {(
                                            accountDetail.equityCAD +
                                            accountDetail.cashCAD
                                        ).toFixed(2)}
                                    </Td>
                                    <Td isNumeric>
                                        $
                                        {(
                                            accountDetail.equityUSD +
                                            accountDetail.cashUSD
                                        ).toFixed(2)}
                                    </Td>
                                    <Td isNumeric>
                                        $
                                        {(
                                            accountDetail.equityTotal +
                                            accountDetail.cashTotal
                                        ).toFixed(2)}
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Th>Equity</Th>
                                    <Td isNumeric>
                                        ${accountDetail.equityCAD.toFixed(2)}
                                    </Td>
                                    <Td isNumeric>
                                        ${accountDetail.equityUSD.toFixed(2)}
                                    </Td>
                                    <Td isNumeric>
                                        ${accountDetail.equityTotal.toFixed(2)}
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Th>Cash</Th>
                                    <Td isNumeric>
                                        ${accountDetail.cashCAD.toFixed(2)}
                                    </Td>
                                    <Td isNumeric>
                                        ${accountDetail.cashUSD.toFixed(2)}
                                    </Td>
                                    <Td isNumeric>
                                        ${accountDetail.cashTotal.toFixed(2)}
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Th>Gain/Loss</Th>
                                    <Td isNumeric>CAD</Td>
                                    <Td isNumeric>USD</Td>
                                    <Td isNumeric>Total</Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Flex>

                {/* Holdings */}
                <Tabs
                    isFitted
                    variant="enclosed"
                    px={4}
                    pt={8}
                    borderBottomColor="rgba(0,0,0,0)"
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
                            Portfolio
                        </Tab>
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
                    </TabList>
                    <TabPanels>
                        <TabPanel p={0}>one</TabPanel>
                        <TabPanel p={0}>
                            <HoldingList userId={props.userId} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Flex>
        );
    }
}

export default Profile;
