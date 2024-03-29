import React, { useState, useEffect, useRef } from 'react';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    ChatIcon,
    MinusIcon,
} from '@chakra-ui/icons';
import {
    Flex,
    Box,
    Center,
    Input,
    Circle,
    InputGroup,
    InputRightAddon,
} from '@chakra-ui/react';
import useComponentMinimize from '../../useComponentMinimize';
import '../../styles/global.scss';
import Message from './Message';

const maxInputLen = 50;

const ChatBot = props => {
    const msgListRef = useRef(undefined);
    const [userMsg, setUserMsg] = useState('');
    const [inputLen, setInputLen] = useState(0);
    const { ref, isComponentMinimized, setIsComponentMinimized } =
        useComponentMinimize(true);

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
        setIsComponentMinimized(true);
    };

    const handleOpen = () => {
        setIsComponentMinimized(false);
    };

    useEffect(() => {
        if (!isComponentMinimized)
            msgListRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            });
    });

    useEffect(() => {
        setInputLen(userMsg.length);
    }, [userMsg]);

    return (
        <Box ref={ref}>
            <Box
                display={isComponentMinimized ? 'none' : 'block'}
                pos="fixed"
                top={{ base: '0', lg: 'auto' }}
                bottom={{ base: '0', lg: '100px', xl: '32px' }}
                right={{ base: '0', lg: '32px' }}
                h={{ base: 'auto', lg: '500px' }}
                w={{ base: '100%', lg: '300px' }}
                boxShadow="xl"
                borderRadius="12px"
                zIndex="12"
            >
                <Box
                    pos="relative"
                    h="100%"
                    bg="light.white"
                    borderRadius="inherit"
                >
                    <Center
                        justifyContent="center"
                        fontSize={{ base: '20px', lg: '16px' }}
                        h={{ base: '48px', lg: '40px' }}
                        w="100%"
                        bg="light.black"
                        color="light.white"
                        fontWeight="bold"
                        borderTopRadius={{ base: '0', lg: '12px' }}
                        cursor="pointer"
                        onClick={handleClose}
                    >
                        Trading GPT
                        <MinusIcon
                            display={{ base: 'none', lg: 'block' }}
                            pos="absolute"
                            color="light.white"
                            transform="translateX(130px)"
                        />
                    </Center>
                    <Flex direction="column" w="100%" bg="light.white">
                        <Box
                            h={{ base: 'calc(100vh - 140px)', lg: '390px' }}
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
                            <InputGroup
                                size="sm"
                                w="100%"
                                fontSize="16px"
                                mx="20px"
                                borderRadius="30px"
                                borderWidth="1px"
                                borderStyle="solid"
                                borderColor="light.grey"
                                _focusWithin={{
                                    boxShadow: '0 0 0 2px #ffce63',
                                    borderColor: 'light.yellow',
                                }}
                            >
                                <Input
                                    placeholder="Message"
                                    disabled={props.inputStatus}
                                    h={{ base: '50px', lg: '30px' }}
                                    maxLength="50"
                                    borderLeftRadius="30px"
                                    borderWidth="0px"
                                    focusBorderColor="transparent"
                                    value={userMsg}
                                    onChange={e => handleMsgChange(e)}
                                    onKeyDown={e => handleKeyDown(e)}
                                />
                                <InputRightAddon
                                    h={{ base: '50px', lg: '30px' }}
                                    color="light.grey"
                                    bg="light.white"
                                    children={`${inputLen}/${maxInputLen}`}
                                    borderRightRadius="30px"
                                    borderWidth="0px"
                                />
                            </InputGroup>
                        </Center>
                    </Flex>
                </Box>
            </Box>
            <Center
                display={
                    isComponentMinimized ? { base: 'none', lg: 'flex' } : 'none'
                }
                className="bounce-box"
                pos="fixed"
                bottom={{ base: '100px', xl: '32px' }}
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
            <Flex
                display={{ base: 'flex', lg: 'none' }}
                alignItems="center"
                pos="fixed"
                bottom="100px"
                right="0"
                zIndex={isComponentMinimized ? '1' : '13'}
                w={isComponentMinimized ? '54px' : '94px'}
                h="50px"
                borderLeftRadius="25px"
                bg="light.black"
                color="light.white"
                cursor="pointer"
                transition="width 0.3s ease"
                onClick={isComponentMinimized ? handleOpen : handleClose}
            >
                {isComponentMinimized ? (
                    <ArrowLeftIcon transform="translate(15px)" />
                ) : (
                    <ArrowRightIcon transform="translate(20px)" />
                )}
            </Flex>
        </Box>
    );
};

export default ChatBot;
