import React, { useEffect, useState } from 'react';
import { Flex, Box, Heading, Text } from '@chakra-ui/react';
import { getUser } from '../global/axios';

function Profile(props) {
    const [userData, setUserData] = useState(undefined);

    useEffect(() => {
        getUser(props.userId).then(response => {
            setUserData(response.data);
        });
    }, []);

    if (userData !== undefined) {
        return (
            <Flex direction="column">
                {/* Profile Header in Mobile */}
                <Flex
                    bg="light.navy"
                    px={4}
                    pt={8}
                    pb={4}
                    gap="16px"
                    direction="column"
                    justifyContent="space-between"
                >
                    <Box>
                        <Heading color="light.white" size="xl">
                            Welcome!
                        </Heading>
                        <Heading color="light.white" size="lg">
                            {userData.first_name} {userData.last_name}
                        </Heading>
                    </Box>

                    <Flex direction="column">
                        <Text color="light.white">
                            "Be fearful when others are greedy and be greed when
                            others are fearful."
                        </Text>
                        <Text color="light.white" alignSelf="end">
                            ---- Warren Buffett
                        </Text>
                    </Flex>
                </Flex>

                {/* Account Details */}
                <Flex>
                    <Heading>Account Details</Heading>
                </Flex>
            </Flex>
        );
    }
}

export default Profile;
