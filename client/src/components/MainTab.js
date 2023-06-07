import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import {
    Profile,
    CandleStick,
    History,
    Login,
    Fund,
    Funding,
    Trading,
} from '../styles/icons';
import '../styles/global.scss';

function MainTab() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [page, setPage] = useState('');

    return (
        <>
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
                    color={page === 'profile' ? 'light.yellow' : 'light.black'}
                    _hover={{ color: 'light.yellow' }}
                >
                    <NavLink
                        to="/profile"
                        onClick={() => {
                            onClose();
                            setPage('profile');
                        }}
                    >
                        <Profile variant="btn" />
                    </NavLink>
                </Box>
                <Box
                    color={
                        page === 'watchlist' ? 'light.yellow' : 'light.black'
                    }
                    _hover={{ color: 'light.yellow' }}
                >
                    <NavLink to="/watchlist">
                        <CandleStick
                            variant="btn"
                            onClick={() => {
                                onClose();
                                setPage('watchlist');
                            }}
                        />
                    </NavLink>
                </Box>
                <Box
                    color={page === 'money' ? 'light.yellow' : 'light.black'}
                    _hover={{ color: 'light.yellow' }}
                >
                    <Fund variant="btn" onClick={onOpen} />
                </Box>

                <Box
                    color={page === 'history' ? 'light.yellow' : 'light.black'}
                    _hover={{ color: 'light.yellow' }}
                >
                    <NavLink
                        to="/history"
                        onClick={() => {
                            onClose();
                            setPage('history');
                        }}
                    >
                        <History variant="btn" />
                    </NavLink>
                </Box>

                {/* <Login variant="btn" onClick={onClose} /> */}
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
                                    setPage('money');
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
                                to="trading"
                                className="nav-link"
                                onClick={() => {
                                    onClose();
                                    setPage('money');
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
        </>
    );
}

export default MainTab;
