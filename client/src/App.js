// import logo from './logo.svg';
// import './App.css';
import { Box } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Profile from './components/Profile';
import CandleStick from './components/CandleStick';
import History from './components/History';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Box>Hello WOrld</Box>
                <Routes>
                    <Route path="/" element={<Profile />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/candlestick" element={<CandleStick />} />
                    <Route path="/history" element={<History />} />
                </Routes>
                <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;