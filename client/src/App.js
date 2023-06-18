// import logo from './logo.svg';
// import './App.css';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainTab from './components/MainTab';
import TopTab from './components/TopTab';
import FundingForm from './components/Action/FundingForm';
import TradingForm from './components/Action/TradingForm';
import Profile from './components/Profile/Profile';
import Watchlist from './components/Watchlist/Watchlist';
import Txn from './components/Transaction/Transaction';
import { Box } from '@chakra-ui/react';

function App() {
    const [page, setPage] = useState('');

    const changePage = path => {
        setPage(path);
    };

    return (
        <BrowserRouter>
            <TopTab />
            <Routes>
                <Route
                    path="/"
                    element={
                        <Profile userId={'evancheng'} changePage={changePage} />
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <Profile userId={'evancheng'} changePage={changePage} />
                    }
                />
                <Route
                    path="/watchlist"
                    element={<Watchlist userId={'evancheng'} />}
                />
                <Route path="/history" element={<Txn userId={'evancheng'} />} />
                <Route
                    path="/funding"
                    element={
                        <FundingForm
                            userId={'evancheng'}
                            changePage={changePage}
                        />
                    }
                />
                <Route
                    path="/trading"
                    element={
                        <TradingForm
                            userId={'evancheng'}
                            changePage={changePage}
                        />
                    }
                />
            </Routes>
            <Box h={20}/>
            <MainTab page={page} changePage={changePage} />
        </BrowserRouter>
    );
}

export default App;
