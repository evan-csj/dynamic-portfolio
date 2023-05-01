import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import { Profile, CandleStick, History, Login } from '../styles/icons';

function Footer() {
    return (
        <Flex justifyContent="space-between">
            <NavLink to="/profile">
                <Profile variant="btn" />
            </NavLink>
            <NavLink to="/candlestick">
                <CandleStick variant="btn" />
            </NavLink>
            <NavLink to="/history">
                <History variant="btn" />
            </NavLink>
            <Login variant="btn" />
        </Flex>
    );
}

export default Footer;
