import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import { Profile, CandleStick, History, Login, Fund } from '../styles/icons';

function Footer() {
    return (
        <Flex
            justifyContent="space-between"
            pos="fixed"
            w="100%"
            bottom="0"
            display={{ base: 'flex', md: 'none' }}
        >
            <NavLink to="/profile">
                <Profile variant="btn" />
            </NavLink>
            <NavLink to="/candlestick">
                <CandleStick variant="btn" />
            </NavLink>
            <Fund variant="btn" />
            <NavLink to="/history">
                <History variant="btn" />
            </NavLink>
            <Login variant="btn" />
        </Flex>
    );
}

export default Footer;
