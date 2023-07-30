import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flex, Box } from '@chakra-ui/react';
import '../styles/global.scss';

const NavBarTop = props => {
    return (
        <Box>
            <Flex
                bg="light.white"
                w="1020px"
                mx="auto"
                gap={4}
                py={2}
                justifyContent="flex-start"
                display={{ base: 'none', xl: 'flex' }}
                zIndex={10}
                fontSize="18px"
            >
                <Box _hover={{ color: 'light.yellow' }}>
                    <NavLink to="/profile">Home</NavLink>
                </Box>
                <Box _hover={{ color: 'light.yellow' }}>
                    <NavLink to="/watchlist">Watchlist</NavLink>
                </Box>

                <Box _hover={{ color: 'light.yellow' }}>
                    <NavLink to="/funding">Funding</NavLink>
                </Box>

                <Box _hover={{ color: 'light.yellow' }}>
                    <NavLink to="/trading">Trading</NavLink>
                </Box>

                <Box _hover={{ color: 'light.yellow' }}>
                    <NavLink to="/history">History</NavLink>
                </Box>

                {/* <Login variant="btn" onClick={onClose} /> */}
            </Flex>
        </Box>
    );
};

export default NavBarTop;
