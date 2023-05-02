import React, { useEffect, useState } from 'react';
import { Flex, Box, Heading, Text, Grid, GridItem } from '@chakra-ui/react';
import { getUser } from '../global/axios';

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
                    <Heading>Account Details</Heading>
                    <Grid
                        templateAreas={`"Empty CAD USD Total" 
                                        "Assets A1 B1 C1" 
                                        "Equity A2 B2 C2" 
                                        "Cash A3 B3 C3"
                                        "GL A4 B4 C4"`}
                        gridTemplateRows={'repeat(5, 1fr)'}
                        gridTemplateColumns={'repeat(4, 1fr)'}
                    >
                        <GridItem area={'Empty'}></GridItem>
                        <GridItem area={'CAD'}>CAD</GridItem>
                        <GridItem area={'USD'}>USD</GridItem>
                        <GridItem area={'Total'}>Total</GridItem>
                        <GridItem area={'Assets'}>Assets</GridItem>
                        <GridItem area={'Equity'}>Equity</GridItem>
                        <GridItem area={'Cash'}>Cash</GridItem>
                        <GridItem area={'GL'}>Gain/Loss</GridItem>
                        <GridItem area={'A1'}>$A1</GridItem>
                        <GridItem area={'B1'}>$B1</GridItem>
                        <GridItem area={'C1'}>$C1</GridItem>
                        <GridItem area={'A2'}>$A2</GridItem>
                        <GridItem area={'B2'}>$B2</GridItem>
                        <GridItem area={'C2'}>$C2</GridItem>
                        <GridItem area={'A3'}>$A3</GridItem>
                        <GridItem area={'B3'}>$B3</GridItem>
                        <GridItem area={'C3'}>$C3</GridItem>
                        <GridItem area={'A4'}>$A4</GridItem>
                        <GridItem area={'B4'}>$B4</GridItem>
                        <GridItem area={'C4'} className='right'>
                            $C4
                        </GridItem>
                    </Grid>
                </Flex>
            </Flex>
        );
    }
}

export default Profile;
