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
} from '@chakra-ui/react';
import { getUser } from '../global/axios';
import '../styles/global.scss';

function Profile(props) {
    const [userData, setUserData] = useState(undefined);

    useEffect(() => {
        getUser(props.userId).then(response => {
            setUserData(response.data);
        });
    }, [props.userId]);

    if (userData !== undefined) {
        return (
            <Flex direction="column">
                {/* Profile Header in Mobile */}
                <Flex
                    bg="light.navy"
                    px={4}
                    pt={8}
                    pb={4}
                    borderColor="light.yellow"
                    borderBottomWidth="4px"
                    gap={4}
                    justifyContent="space-between"
                    direction="column"
                >
                    <Box>
                        <Heading color="light.white" size="xl">
                            Welcome!
                        </Heading>
                        <Heading color="light.yellow" size="lg">
                            {userData.first_name} {userData.last_name}
                        </Heading>
                    </Box>

                    <Flex direction="column">
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
                <Flex direction="column">
                    <Heading px={4} py={4}>
                        Account Details
                    </Heading>
                    <TableContainer px={{ base: '4' }}>
                        <Table
                            size="sm"
                            variant="simple"
                            className="table-user"
                        >
                            <Thead>
                                <Tr>
                                    <Th></Th>
                                    <Th isNumeric>CAD</Th>
                                    <Th isNumeric>USD</Th>
                                    <Th isNumeric>Total</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Th>Assets</Th>
                                    <Td isNumeric>CAD</Td>
                                    <Td isNumeric>USD</Td>
                                    <Td isNumeric>Total</Td>
                                </Tr>
                                <Tr>
                                    <Th>Equity</Th>
                                    <Td isNumeric>CAD</Td>
                                    <Td isNumeric>USD</Td>
                                    <Td isNumeric>Total</Td>
                                </Tr>
                                <Tr>
                                    <Th>Cash</Th>
                                    <Td isNumeric>${userData.cash_cad}</Td>
                                    <Td isNumeric>${userData.cash_usd}</Td>
                                    <Td isNumeric>Total</Td>
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
                <Flex>
                    
                </Flex>
            </Flex>
        );
    }
}

export default Profile;
