// import logo from './logo.svg';
// import './App.css';
import { Box } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainTab from './components/MainTab';
import Profile from './components/Profile/Profile';
import CandleStick from './components/CandleStick';
import Txn from './components/Transaction/Transaction';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Profile userId={'evancheng'} />} />
                <Route
                    path="/profile"
                    element={<Profile userId={'evancheng'} />}
                />
                <Route path="/candlestick" element={<CandleStick />} />
                <Route
                    path="/history"
                    element={<Txn userId={'evancheng'} />}
                />
            </Routes>
            <MainTab />
        </BrowserRouter>
    );
}

export default App;
