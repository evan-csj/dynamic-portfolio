import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import { Profile, CandleStick, History, Login, Fund } from '../styles/icons';

function MainTab() {
    return (
        <Flex
            bg="light.white"
            shadow="mainTab"
            w="100%"
            px={4}
            py={2}
            borderTopRadius={20}
            pos="fixed"
            bottom={0}
            justifyContent="space-between"
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

export default MainTab;
