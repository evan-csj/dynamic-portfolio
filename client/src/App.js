import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import FundingForm from './components/Action/FundingForm';
import TradingForm from './components/Action/TradingForm';
import Profile from './components/Profile/Profile';
import Watchlist from './components/Watchlist/Watchlist';
import Txn from './components/Transaction/Transaction';
import ChatBot from './components/ChatBot/ChatBot';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { chatgpt } from './global/axios';
import useWebSocket from 'react-use-websocket';
import {
    Flex,
    SkeletonCircle,
    Text,
    Box,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react';
import { Funding, Trading } from './styles/icons';

function App() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [page, setPage] = useState('');
    const [toggle, setToggle] = useState(false);
    const [subscribe, setSubscribe] = useState([]);
    const [waitForRes, setWaitForRes] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isFundingOpen,
        onOpen: fundingOpen,
        onClose: fundingClose,
    } = useDisclosure();
    const {
        isOpen: isTradingOpen,
        onOpen: tradingOpen,
        onClose: tradingClose,
    } = useDisclosure();
    const [messages, setmessages] = useState([
        {
            message: "Hi! I'm an AI ChatBot",
            sender: 'Bot',
        },
        {
            message: 'What can I do for you?',
            sender: 'Bot',
        },
    ]);
    const FINNHUB_KEY = process.env.REACT_APP_FINNHUB_KEY;
    const socketUrl = `wss://ws.finnhub.io?token=${FINNHUB_KEY}`;
    const { sendMessage, lastMessage } = useWebSocket(socketUrl, {
        onOpen: () => console.log('Link Start'),
        onClose: () => console.log('You Lost'),
        shouldReconnect: closeEvent => true,
    });

    const changePage = path => {
        setPage(path);
    };

    const login = username => {
        setUsername(username);
    };

    const unsubscribeAll = () => {
        for (const symbol of subscribe) {
            sendMessage(
                JSON.stringify({ type: 'unsubscribe', symbol: symbol })
            );
        }
    };

    const addMessage = (text, sender) => {
        setmessages([
            ...messages,
            { message: text, sender: sender },
            {
                message: (
                    <Flex alignItems="end" direction="row" gap="8px" h="16px">
                        <SkeletonCircle w="8px" h="8px">
                            X
                        </SkeletonCircle>
                        <SkeletonCircle w="8px" h="8px">
                            X
                        </SkeletonCircle>
                        <SkeletonCircle w="8px" h="8px">
                            X
                        </SkeletonCircle>
                    </Flex>
                ),
                sender: 'Bot',
            },
        ]);
        if (sender === 'User') {
            setWaitForRes(true);
            chatgpt(text)
                .then(response => {
                    setWaitForRes(false);
                    setmessages([
                        ...messages,
                        { message: text, sender: 'User' },
                        {
                            message: response.data.answer || response.data,
                            sender: 'Bot',
                        },
                    ]);
                    if (response.data.intent !== undefined) {
                        const intent = response.data.intent.split('.');
                        if (intent[0] === 'nav') {
                            navigate(`/${intent[1]}`);
                            setPage(`${intent[1]}`);
                        }
                    }
                })
                .catch(_error => {
                    setmessages([
                        ...messages,
                        { message: text, sender: 'User' },
                    ]);
                });
        }
    };

    const closeAllDrawer = () => {
        fundingClose();
        tradingClose();
        onClose();
    };

    // useEffect(() => {
    //     if (lastMessage !== null) {
    //         const json = JSON.parse(lastMessage.data);
    //         const type = json.type;
    //         if (type === 'trade') {
    //             const data = json.data;
    //             const price = data[0].p;
    //             const symbol = data[0].s;
    //             console.log(symbol, price);
    //         }
    //     }
    // }, [lastMessage]);

    return (
        <>
            <NavBar
                page={page}
                changePage={changePage}
                display={{ base: 'none', xl: 'block' }}
                isOpen={isOpen}
                openDrawer={onOpen}
                openFunding={fundingOpen}
                openTrading={tradingOpen}
                closeAllDrawer={closeAllDrawer}
            />
            <Routes>
                <Route
                    path="/"
                    element={
                        <Login login={login} unsubscribeAll={unsubscribeAll} />
                    }
                />
                <Route
                    path="/login"
                    element={
                        <Login login={login} unsubscribeAll={unsubscribeAll} />
                    }
                />
                <Route path="/signup" element={<SignUp />} />
                <Route
                    path="/profile"
                    element={
                        <Profile
                            toggle={toggle}
                            userId={username}
                            changePage={changePage}
                            sendMessage={sendMessage}
                            lastMessage={lastMessage}
                            setSubscribe={setSubscribe}
                            unsubscribeAll={unsubscribeAll}
                        />
                    }
                />
                <Route
                    path="/watchlist"
                    element={
                        <Watchlist
                            userId={username}
                            sendMessage={sendMessage}
                            lastMessage={lastMessage}
                            setSubscribe={setSubscribe}
                            unsubscribeAll={unsubscribeAll}
                        />
                    }
                />
                <Route
                    path="/history"
                    element={
                        <Txn
                            toggle={toggle}
                            userId={username}
                            unsubscribeAll={unsubscribeAll}
                        />
                    }
                />
            </Routes>
            <ChatBot
                messages={messages}
                addMessage={addMessage}
                inputStatus={waitForRes}
            />
            <NavBar
                page={page}
                changePage={changePage}
                display={{ base: 'block', xl: 'none' }}
                isOpen={isOpen}
                openDrawer={onOpen}
                openFunding={fundingOpen}
                openTrading={tradingOpen}
                closeAllDrawer={closeAllDrawer}
            />
            <Drawer placement={'bottom'} onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay zIndex={1} display={{ xl: 'none' }} />
                <DrawerContent shadow="none" borderTopRadius={20}>
                    <DrawerBody display={{ xl: 'none' }}>
                        <Flex
                            className="flex-col"
                            w="fit-content"
                            py={4}
                            gap={4}
                            fontSize={{ base: '12px', md: '14px', lg: '16px' }}
                        >
                            <Box
                                className="no-outline"
                                cursor="pointer"
                                onClick={() => {
                                    fundingOpen();
                                    onClose();
                                }}
                            >
                                <Flex
                                    alignItems="center"
                                    gap={4}
                                    _hover={{ color: 'light.yellow' }}
                                >
                                    <Funding boxSize={8} />
                                    <Box>
                                        <Text>Funding</Text>
                                        <Text>Deposit or withdraw funds</Text>
                                    </Box>
                                </Flex>
                            </Box>
                            <Box
                                className="no-outline"
                                cursor="pointer"
                                onClick={() => {
                                    onClose();
                                    tradingOpen();
                                }}
                            >
                                <Flex
                                    alignItems="center"
                                    gap={4}
                                    _hover={{ color: 'light.yellow' }}
                                >
                                    <Trading boxSize={8} />
                                    <Box>
                                        <Text>Trading</Text>
                                        <Text>
                                            Buy or sell S&P 500 and NASDAQ 100
                                            stocks
                                        </Text>
                                    </Box>
                                </Flex>
                            </Box>
                        </Flex>
                        <Box h={16} />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            <Drawer
                placement={window.innerWidth >= 1280 ? 'right' : 'bottom'}
                onClose={fundingClose}
                isOpen={isFundingOpen}
                size={{ base: 'full', xl: 'md' }}
            >
                <DrawerOverlay zIndex={1} />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerBody>
                        <FundingForm
                            userId={username}
                            changePage={changePage}
                            unsubscribeAll={unsubscribeAll}
                            closeDrawer={closeAllDrawer}
                            toggle={toggle}
                            updateToggle={setToggle}
                        />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            <Drawer
                placement={window.innerWidth >= 1280 ? 'right' : 'bottom'}
                onClose={tradingClose}
                isOpen={isTradingOpen}
                size={{ base: 'full', xl: 'md' }}
            >
                <DrawerOverlay zIndex={1} />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerBody>
                        <TradingForm
                            userId={username}
                            changePage={changePage}
                            sendMessage={sendMessage}
                            lastMessage={lastMessage}
                            setSubscribe={setSubscribe}
                            unsubscribeAll={unsubscribeAll}
                            closeDrawer={closeAllDrawer}
                            toggle={toggle}
                            updateToggle={setToggle}
                        />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}

export default App;
