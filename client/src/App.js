// import logo from './logo.svg';
// import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainTab from './components/MainTab';
import TopTab from './components/TopTab';
import FundingForm from './components/FundingForm';
import TradingForm from './components/TradingForm';
import Profile from './components/Profile/Profile';
import Watchlist from './components/Watchlist/Watchlist';
import Txn from './components/Transaction/Transaction';

function App() {
    return (
        <BrowserRouter>
            <TopTab />
            <Routes>
                <Route path="/" element={<Profile userId={'evancheng'} />} />
                <Route path="/profile" element={<Profile userId={'evancheng'} />} />
                <Route path="/watchlist" element={<Watchlist userId={'evancheng'} />} />
                <Route path="/history" element={<Txn userId={'evancheng'} />} />
                <Route path="/funding" element={<FundingForm userId={'evancheng'} />} />
                <Route path="/trading" element={<TradingForm userId={'evancheng'} />} />
            </Routes>
            <MainTab />
        </BrowserRouter>
    );
}

export default App;
