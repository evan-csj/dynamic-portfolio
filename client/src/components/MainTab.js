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
import { Profile, CandleStick, History, Login, Fund } from '../styles/icons';
import '../styles/global.scss';

function MainTab() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Flex
                bg="light.white"
                shadow={isOpen ? '' : 'mainTab'}
                w="100%"
                px={4}
                py={2}
                borderTopRadius={20}
                pos="fixed"
                bottom={0}
                justifyContent="space-between"
                display={{ base: 'flex', xl: 'none' }}
                zIndex={10}
            >
                <NavLink to="/profile" onClick={onClose}>
                    <Profile variant="btn" />
                </NavLink>
                <NavLink to="/watchlist">
                    <CandleStick variant="btn" onClick={onClose} />
                </NavLink>

                <Fund variant="btn" onClick={onOpen} />

                <NavLink to="/history">
                    <History variant="btn" onClick={onClose} />
                </NavLink>
                <Login variant="btn" onClick={onClose} />
            </Flex>
            <Drawer placement={'bottom'} onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay zIndex={1} />
                <DrawerContent shadow="none" borderTopRadius={20}>
                    <DrawerBody>
                        <Flex
                            className="flex-col"
                            pt={4}
                            fontSize={{ base: '12px', md: '14px', lg: '16px'}}
                        >
                            <NavLink to="/funding" className="nav-link" onClick={onClose}>
                                <Flex className="flex-col">
                                    <Text>Funding</Text>
                                    <Text>Deposit or withdraw funds</Text>
                                </Flex>
                            </NavLink>
                            <NavLink to="trading" className="nav-link" onClick={onClose}>
                                <Text>Trading</Text>
                                <Text>Buy or sell stocks and ETFs</Text>
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
