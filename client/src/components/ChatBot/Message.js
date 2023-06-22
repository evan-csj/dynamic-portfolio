import React from 'react';
import { Flex, Box, Circle } from '@chakra-ui/react';

const Message = props => {
    return props.sender === 'Bot' ? (
        <Flex
            direction="row"
            justifyContent="space-between"
            alignItems="flex-end"
            flexWrap="nowrap"
            gap="8px"
            alignSelf="flex-start"
        >
            <Circle size={{ base: '36px', lg: '32px' }} bg="light.blue" />
            <Box
                flex={1}
                fontSize={{ base: '18px', lg: '12px' }}
                minH={{ base: '36px', lg: '32px' }}
                maxW={{ base: '75vw', lg: '200px' }}
                h="fit-content"
                bg="light.silver"
                borderRadius="5px"
                p="8px"
                overflowWrap="break-word"
            >
                {props.msg}
            </Box>
        </Flex>
    ) : (
        <Flex
            direction="row"
            justifyContent="space-between"
            alignItems="flex-end"
            flexWrap="nowrap"
            gap="8px"
            alignSelf="flex-end"
        >
            <Box
                flex={1}
                fontSize={{ base: '18px', lg: '12px' }}
                minH={{ base: '36px', lg: '32px' }}
                maxW={{ base: '75vw', lg: '200px' }}
                h="fit-content"
                bg="light.silver"
                borderRadius="5px"
                p="8px"
                overflowWrap="break-word"
            >
                {props.msg}
            </Box>
            <Circle size={{ base: '36px', lg: '32px' }} bg="light.yellow" />
        </Flex>
    );
};

export default Message;
