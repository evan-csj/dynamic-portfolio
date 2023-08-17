import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Text,
    Flex,
    Box,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    Circle,
} from '@chakra-ui/react';
import {
    Profile,
    CandleStick,
    History,
    Logout,
    Fund,
    Funding,
    Trading,
} from '../styles/icons';
import '../styles/global.scss';

const NavBarBot = props => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [navSelect, setNavSelect] = useState(undefined);

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
                        <NavLink to="/funding">Funding</NavLink>
                    </Box>

                    <Box _hover={{ color: 'light.yellow' }}>
                        <NavLink to="/trading">Trading</NavLink>
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
                                onClose();
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
                            onClose();
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
                                onClose();
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
                    <Fund variant="btn" onClick={onOpen} />
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
                            onClose();
                            props.changePage('history');
                        }}
                    >
                        <History variant="btn" />
                    </NavLink>
                </Box>

                <Box _hover={{ color: 'light.yellow' }}>
                    <NavLink
                        to="/login"
                        onClick={() => {
                            onClose();
                            sessionStorage.clear();
                        }}
                    >
                        <Logout variant="btn" />
                    </NavLink>
                </Box>
            </Flex>

            <Drawer placement={'bottom'} onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay zIndex={1} display={{ xl: 'none' }} />
                <DrawerContent shadow="none" borderTopRadius={20}>
                    <DrawerBody display={{ xl: 'none' }}>
                        <Flex
                            className="flex-col"
                            pt={4}
                            fontSize={{ base: '12px', md: '14px', lg: '16px' }}
                        >
                            <NavLink
                                to="/funding"
                                className="nav-link"
                                onClick={() => {
                                    onClose();
                                    props.changePage('funding');
                                }}
                            >
                                <Flex
                                    alignItems="center"
                                    gap={4}
                                    _hover={{ color: 'light.yellow' }}
                                >
                                    <Funding boxSize={8} />
                                    <Box>
                                        <Text>Funding</Text>
                                        <Text>Deposit or withdraw funds</Text>
                                    </Box>
                                </Flex>
                            </NavLink>
                            <NavLink
                                to="/trading"
                                className="nav-link"
                                onClick={() => {
                                    onClose();
                                    props.changePage('trading');
                                }}
                            >
                                <Flex
                                    alignItems="center"
                                    gap={4}
                                    _hover={{ color: 'light.yellow' }}
                                >
                                    <Trading boxSize={8} />
                                    <Box>
                                        <Text>Trading</Text>
                                        <Text>
                                            Buy or sell S&P 500 and NASDAQ 100
                                            stocks
                                        </Text>
                                    </Box>
                                </Flex>
                            </NavLink>
                        </Flex>
                        <Box h={16} />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
};

export default NavBarBot;
