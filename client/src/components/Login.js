import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Flex,
    Box,
    Center,
    Input,
    FormControl,
    FormLabel,
    Button,
    Stack,
    Image,
} from '@chakra-ui/react';
import logo from '../assets/logo.svg';
import '../styles/global.scss';

const Login = props => {
    return (
        <Center h="100vh" w="100vw" pos="relative">
            <Center w={{ base: '100%', md: '480px' }} data-peer>
                <Center
                    h="500px"
                    w="100%"
                    mx="16px"
                    px="64px"
                    bg="light.white"
                    borderRadius="24px"
                    boxShadow="2xl"
                >
                    <Flex
                        direction="column"
                        alignItems="center"
                        gap="24px"
                        w="100%"
                    >
                        <Image src={logo} alt="logo" boxSize="120px" />
                        <FormControl>
                            <FormLabel>User ID</FormLabel>
                            <Input placeholder="Please enter user ID"></Input>
                            <Box h="24px" />
                            <FormLabel>Password</FormLabel>
                            <Input placeholder="Please enter password"></Input>
                        </FormControl>
                        <Flex
                            w="100%"
                            gap="16px"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Button
                                flex="1"
                                color="light.navy"
                                borderColor="light.navy"
                                borderWidth="2px"
                                borderStyle="solid"
                                bg="light.white"
                                _hover={{ bg: 'light.silver' }}
                            >
                                <NavLink to={'/signup'}>Sign Up</NavLink>
                            </Button>
                            <Button
                                flex="1"
                                color="light.white"
                                bg="light.navy"
                                borderWidth="2px"
                                borderColor="light.navy"
                                borderStyle="solid"
                                _hover={{
                                    bg: 'light.yellow',
                                    color: 'light.black',
                                    borderColor: 'light.navy',
                                }}
                            >
                                Login
                            </Button>
                        </Flex>
                    </Flex>
                </Center>
            </Center>

            <Box
                bg="light.yellow"
                pos="absolute"
                w="100vw"
                h="500vh"
                left="-50vw"
                _peerHover={{
                    transform:
                        'rotate(21.8deg) translateX(calc(-15vw)) translateY(calc(15vw))',
                }}
                transition="transform 0.3s ease"
                zIndex="-1"
            />
            <Box
                bg="light.navy"
                pos="absolute"
                w="100vw"
                h="500vh"
                right="-50vw"
                _peerHover={{
                    transform:
                        'rotate(21.8deg) translateX(calc(15vw)) translateY(calc(-15vw))',
                }}
                transition="transform 0.3s ease"
                zIndex="-1"
            />
        </Center>
    );
};

export default Login;
