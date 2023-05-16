import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import '../styles/global.scss';

function TopTab() {
    return (
        <Flex
            bg="light.white"
            w="1020px"
            mx="auto"
            gap={4}
            py={2}
            justifyContent="flex-start"
            display={{ base: 'none', xl: 'flex' }}
            zIndex={10}
            fontSize="22px"
        >
            <NavLink to="/profile">Home</NavLink>
            <NavLink to="/watchlist">Watchlist</NavLink>
            <NavLink to="/funding">Funding</NavLink>
            <NavLink to="/trading">Trading</NavLink>
            <NavLink to="/history">History</NavLink>
            {/* <Login variant="btn" onClick={onClose} /> */}
        </Flex>
    );
}

export default TopTab;
