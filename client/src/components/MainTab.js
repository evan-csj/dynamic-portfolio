import React from 'react';
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
import { Profile, CandleStick, History, Login, Fund, Funding, Trading } from '../styles/icons';
import '../styles/global.scss';

function MainTab() {
    const { isOpen, onOpen, onClose } = useDisclosure();

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
                <Box _hover={{ color: 'light.yellow' }}>
                    <NavLink to="/profile" onClick={onClose}>
                        <Profile variant="btn" />
                    </NavLink>
                </Box>
                <Box _hover={{ color: 'light.yellow' }}>
                    <NavLink to="/watchlist">
                        <CandleStick variant="btn" onClick={onClose} />
                    </NavLink>
                </Box>
                <Box _hover={{ color: 'light.yellow' }}>
                    <Fund variant="btn" onClick={onOpen} />
                </Box>

                <Box _hover={{ color: 'light.yellow' }}>
                    <NavLink to="/history" onClick={onClose}>
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
                            <NavLink to="/funding" className="nav-link" onClick={onClose}>
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
                            <NavLink to="trading" className="nav-link" onClick={onClose}>
                                <Flex
                                    alignItems="center"
                                    gap={4}
                                    _hover={{ color: 'light.yellow' }}
                                >
                                    <Trading boxSize={8} />
                                    <Box>
                                        <Text>Trading</Text>
                                        <Text>Buy or sell S&P 500 and NASDAQ 100 stocks</Text>
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
