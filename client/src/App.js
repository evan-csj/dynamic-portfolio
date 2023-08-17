import React, { useState } from 'react';
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
import { getFeedback } from './global/axios';
import useWebSocket from 'react-use-websocket';
import { Flex, SkeletonCircle } from '@chakra-ui/react';

function App() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [page, setPage] = useState('');
    const [subscribe, setSubscribe] = useState([]);
    const [waitForRes, setWaitForRes] = useState(false);
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
                    <Flex alignItems="end" dir="row" gap="8px" h="16px">
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
            getFeedback(text)
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
                userId={username}
                sendMessage={sendMessage}
                lastMessage={lastMessage}
                setSubscribe={setSubscribe}
                unsubscribeAll={unsubscribeAll}
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
                            userId={username}
                            unsubscribeAll={unsubscribeAll}
                        />
                    }
                />
                <Route
                    path="/funding"
                    element={
                        <FundingForm
                            userId={username}
                            changePage={changePage}
                            unsubscribeAll={unsubscribeAll}
                        />
                    }
                />
                <Route
                    path="/trading"
                    element={
                        <TradingForm
                            userId={username}
                            changePage={changePage}
                            sendMessage={sendMessage}
                            lastMessage={lastMessage}
                            setSubscribe={setSubscribe}
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
            />
        </>
    );
}

export default App;
