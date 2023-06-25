import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import MainTab from './components/MainTab';
import TopTab from './components/TopTab';
import FundingForm from './components/Action/FundingForm';
import TradingForm from './components/Action/TradingForm';
import Profile from './components/Profile/Profile';
import Watchlist from './components/Watchlist/Watchlist';
import Txn from './components/Transaction/Transaction';
import ChatBot from './components/ChatBot/ChatBot';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { Box } from '@chakra-ui/react';
import { getFeedback } from './global/axios';

function App() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [page, setPage] = useState('');
    const [isLogin, setLogin] = useState(false);
    const [messages, setmessages] = useState([
        {
            message: "Hi! I'm ChatBot",
            sender: 'Bot',
        },
        {
            message: 'What can I do for you?',
            sender: 'Bot',
        },
    ]);

    const changePage = path => {
        setPage(path);
    };

    const addMessage = (text, sender) => {
        setmessages([...messages, { message: text, sender: sender }]);
        if (sender === 'User') {
            getFeedback(text)
                .then(response => {
                    setmessages([
                        ...messages,
                        { message: text, sender: 'User' },
                        { message: response.data.answer, sender: 'Bot' },
                    ]);
                    const intent = response.data.intent.split('.');
                    if (intent[0] === 'nav') {
                        navigate(`/${intent[1]}`);
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

    const login = username => {
        setLogin(true);
        setUsername(username);
    };

    return (
        <>
            <TopTab page={page} changePage={changePage} />
            <Routes>
                <Route path="/" element={<Login login={login} />} />
                <Route path="/login" element={<Login login={login} />} />
                <Route path="/signup" element={<SignUp />} />
                <Route
                    path="/profile"
                    element={
                        <Profile userId={username} changePage={changePage} />
                    }
                />
                <Route
                    path="/watchlist"
                    element={<Watchlist userId={username} />}
                />
                <Route path="/history" element={<Txn userId={username} />} />
                <Route
                    path="/funding"
                    element={
                        <FundingForm
                            userId={username}
                            changePage={changePage}
                        />
                    }
                />
                <Route
                    path="/trading"
                    element={
                        <TradingForm
                            userId={username}
                            changePage={changePage}
                        />
                    }
                />
            </Routes>
            <ChatBot messages={messages} addMessage={addMessage} />
            <MainTab page={page} changePage={changePage} />
        </>
    );
}

export default App;
