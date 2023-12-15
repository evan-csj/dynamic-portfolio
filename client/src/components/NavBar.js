import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Flex, Box, Circle } from '@chakra-ui/react';
import { Profile, CandleStick, History, Logout, Fund } from '../styles/icons';
import { logout } from '../global/axios';
import '../styles/global.scss';
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const NavBar = props => {
    const [navSelect, setNavSelect] = useState(undefined);
    const isOpen = props.isOpen;
    const openFunding = props.openFunding;
    const openTrading = props.openTrading;
    const openDrawer = props.openDrawer;
    const closeAllDrawer = props.closeAllDrawer;

    useEffect(() => {
        const pathname = window.location.pathname;
        if (pathname[0] === '/') setNavSelect(pathname.split('/')[1]);
    });

    return (
        <Box display={props.display}>
            <Flex
                justifyContent="space-between"
                bg="light.white"
                w="1020px"
                mx="auto"
                py={2}
                display={{ base: 'none', xl: 'flex' }}
                zIndex={10}
                fontSize="18px"
            >
                <Flex gap={4} justifyContent="flex-start">
                    <Box
                        color={
                            navSelect === 'profile'
                                ? 'light.yellow'
                                : 'light.black'
                        }
                        _hover={{ color: 'light.yellow' }}
                    >
                        <NavLink to="/profile">Home</NavLink>
                    </Box>
                    <Box
                        color={
                            navSelect === 'watchlist'
                                ? 'light.yellow'
                                : 'light.black'
                        }
                        _hover={{ color: 'light.yellow' }}
                    >
                        <NavLink to="/watchlist">Watchlist</NavLink>
                    </Box>

                    <Box _hover={{ color: 'light.yellow' }}>
                        <Box cursor="pointer" onClick={openFunding}>
                            Funding
                        </Box>
                    </Box>

                    <Box _hover={{ color: 'light.yellow' }}>
                        <Box cursor="pointer" onClick={openTrading}>
                            Trading
                        </Box>
                    </Box>

                    <Box
                        color={
                            navSelect === 'history'
                                ? 'light.yellow'
                                : 'light.black'
                        }
                        _hover={{ color: 'light.yellow' }}
                    >
                        <NavLink to="/history">History</NavLink>
                    </Box>
                </Flex>
                <Flex gap={4} justifyContent="flex-end">
                    <Circle
                        size={{ base: '36px', lg: '32px' }}
                        bg="light.yellow"
                    />
                    <Box _hover={{ color: 'light.yellow' }}>
                        <NavLink
                            to="/login"
                            onClick={() => {
                                closeAllDrawer();
                                sessionStorage.clear();
                            }}
                        >
                            Logout
                        </NavLink>
                    </Box>
                </Flex>
            </Flex>

            <Flex
                bg="light.white"
                shadow={isOpen ? '' : 'mainTab'}
                w="100%"
                px={{ base: '16px', md: '60px', lg: '100px' }}
                py={2}
                borderTopRadius={20}
                pos="fixed"
                bottom={0}
                justifyContent="space-between"
                display={{ base: 'flex', xl: 'none' }}
                zIndex={10}
            >
                <Box
                    color={
                        navSelect === 'profile' ? 'light.yellow' : 'light.black'
                    }
                    _hover={{ color: 'light.yellow' }}
                >
                    <NavLink
                        to="/profile"
                        onClick={() => {
                            closeAllDrawer();
                            props.changePage('profile');
                        }}
                    >
                        <Profile variant="btn" />
                    </NavLink>
                </Box>
                <Box
                    color={
                        navSelect === 'watchlist'
                            ? 'light.yellow'
                            : 'light.black'
                    }
                    _hover={{ color: 'light.yellow' }}
                >
                    <NavLink to="/watchlist">
                        <CandleStick
                            variant="btn"
                            onClick={() => {
                                closeAllDrawer();
                                props.changePage('watchlist');
                            }}
                        />
                    </NavLink>
                </Box>

                <Box
                    color={
                        navSelect === 'trading' || navSelect === 'funding'
                            ? 'light.yellow'
                            : 'light.black'
                    }
                    _hover={{ color: 'light.yellow' }}
                >
                    <Fund variant="btn" onClick={openDrawer} />
                </Box>

                <Box
                    color={
                        navSelect === 'history' ? 'light.yellow' : 'light.black'
                    }
                    _hover={{ color: 'light.yellow' }}
                >
                    <NavLink
                        to="/history"
                        onClick={() => {
                            closeAllDrawer();
                            props.changePage('history');
                        }}
                    >
                        <History variant="btn" />
                    </NavLink>
                </Box>

                <Box _hover={{ color: 'light.yellow' }}>
                    <NavLink
                        to={`${SERVER_URL}/logout`}
                        onClick={() => {
                            closeAllDrawer();
                            sessionStorage.clear();
                            logout();
                        }}
                    >
                        <Logout variant="btn" />
                    </NavLink>
                </Box>
            </Flex>
        </Box>
    );
};

export default NavBar;
