import React from 'react';
import { Heading, Flex, Box, Center } from '@chakra-ui/react';
import '../styles/global.scss';

function History() {
    return (
        <Flex className="flex-col">
            <Center bg="light.navy" color="light.white" h={12} borderBottomColor='light.yellow' borderBottomWidth={4}>
                <Heading size='md'>Transaction History</Heading>
            </Center>
        </Flex>
    );
}

export default History;
