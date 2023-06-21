import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, ChatIcon } from '@chakra-ui/icons';
import { Flex, Box, Center, Input, Circle } from '@chakra-ui/react';
import '../../styles/global.scss';
import Message from './Message';

const ChatBot = props => {
    const msgListRef = useRef(undefined);
    const [isOpen, setIsOpen] = useState(false);
    const [userMsg, setUserMsg] = useState('');

    const handleKeyDown = e => {
        if (e.key === 'Enter' && e.target.value !== '') {
            props.addMessage(e.target.value, 'User');
            setUserMsg('');
        }
    };

    const handleMsgChange = e => {
        setUserMsg(e.target.value);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleOpen = () => {
        setIsOpen(true);
    };

    useEffect(() => {
        if (isOpen)
            msgListRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            });
    });

    if (isOpen) {
        return (
            <Box
                pos="fixed"
                top={{ base: '0', lg: 'auto' }}
                bottom={{ base: '0', lg: '80px', xl: '32px' }}
                right={{ base: '0', lg: '32px' }}
                h={{ base: 'auto', lg: '500px' }}
                w={{ base: '100%', lg: '300px' }}
                boxShadow="xl"
                borderRadius="12px"
                zIndex={{ base: '12', lg: '1' }}
            >
                <Box
                    pos="relative"
                    h="100%"
                    bg="light.white"
                    borderRadius="inherit"
                >
                    <Center
                        justifyContent="center"
                        h="40px"
                        w="100%"
                        bg="light.black"
                        color="light.white"
                        fontWeight="bold"
                        borderTopRadius={{ base: '0', lg: '12px' }}
                        cursor="pointer"
                        onClick={handleClose}
                    >
                        Trading GPT
                    </Center>
                    <Flex direction="column" w="100%" bg="light.white">
                        <Box
                            h={{ base: '100%', lg: '390px' }}
                            pt="20px"
                            px="20px"
                            pb="0"
                            overflowY="scroll"
                            scrollBehavior="smooth"
                        >
                            <Flex
                                direction="column"
                                gap="18px"
                                ref={msgListRef}
                            >
                                {props.messages &&
                                    props.messages.map((msg, i) => {
                                        return (
                                            <Message
                                                key={i}
                                                sender={msg.sender}
                                                msg={msg.message}
                                            />
                                        );
                                    })}
                            </Flex>
                        </Box>
                        <Center
                            pos="absolute"
                            bottom="0"
                            h={{ base: '100px', lg: '70px' }}
                            w="100%"
                        >
                            <Input
                                w="100%"
                                h={{ base: '50px', lg: '30px' }}
                                my="0"
                                mx="20px"
                                fontSize="16px"
                                pl="12px"
                                borderRadius="30px"
                                borderWidth="1px"
                                borderStyle="solid"
                                borderColor="light.grey"
                                placeholder="Chat"
                                value={userMsg}
                                onChange={e => handleMsgChange(e)}
                                onKeyDown={e => handleKeyDown(e)}
                            />
                        </Center>
                    </Flex>
                </Box>
            </Box>
        );
    } else {
        return (
            <Center
                className="bounce-box"
                pos="fixed"
                bottom={{ base: '80px', xl: '32px' }}
                right="0"
                zIndex="1"
                w="70px"
                h="80px"
            >
                <Circle
                    className="close"
                    pos="absolute"
                    bottom="0"
                    right={{ base: '16px', lg: '32px' }}
                    size="60px"
                    bg="light.black"
                    color="light.white"
                    fontSize="24px"
                    cursor="pointer"
                    onClick={handleOpen}
                >
                    <ChatIcon />
                </Circle>
            </Center>
        );
    }
};

export default ChatBot;
