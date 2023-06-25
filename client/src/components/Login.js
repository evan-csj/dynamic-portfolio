import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    Flex,
    Box,
    Center,
    Input,
    InputGroup,
    InputRightElement,
    FormControl,
    FormLabel,
    Button,
    Image,
} from '@chakra-ui/react';
import { checkUserPassword } from '../global/axios';
import logo from '../assets/logo.svg';
import '../styles/global.scss';

const Login = props => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isUsernameCorrect, setUsernameCorrect] = useState(true);
    const [isPasswordCorrect, setPasswordCorrect] = useState(true);
    const [show, setShow] = useState(false);
    const rotateDeg = 25;
    const shiftDis = 20;

    const handleChange = (event, setFc) => {
        const input = event.target.value;
        const noSpace = input.replace(' ', '');
        setFc(noSpace);
        setUsernameCorrect(true);
        setPasswordCorrect(true);
    };

    const handleLogin = async () => {
        if (username === '' || password === '') return;
        const response = await checkUserPassword({
            username: username,
            password: password,
        });
        if (response) {
            setPasswordCorrect(response.data);
            if (response.data) {
                sessionStorage.setItem('userId', username);
                navigate('/profile');
                props.login(username);
            }
        } else {
            setUsernameCorrect(false);
        }
    };

    return (
        <Center
            h="100vh"
            w="100vw"
            bg="light.white"
            overflow="hidden"
            zIndex="15"
            pos="fixed"
            top={0}
        >
            <Center w={{ base: '100%', md: '480px' }} data-peer>
                <Center
                    h="500px"
                    w="100%"
                    mx="16px"
                    px={{ base: '32px', md: '64px' }}
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
                            <Input
                                id="username"
                                value={username}
                                borderColor={
                                    isUsernameCorrect
                                        ? 'light.grey'
                                        : 'light.red'
                                }
                                focusBorderColor="light.yellow"
                                placeholder="Please enter user ID"
                                onChange={event =>
                                    handleChange(event, setUsername)
                                }
                            ></Input>
                            <Box h="24px" />
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input
                                    fontFamily={
                                        show || password === ''
                                            ? 'inherit'
                                            : 'Roboto'
                                    }
                                    borderColor={
                                        isPasswordCorrect
                                            ? 'light.grey'
                                            : 'light.red'
                                    }
                                    id="password"
                                    value={password}
                                    focusBorderColor="light.yellow"
                                    type={show ? 'text' : 'password'}
                                    placeholder="Please enter password"
                                    onChange={event =>
                                        handleChange(event, setPassword)
                                    }
                                />
                                <InputRightElement w="64px">
                                    <Button
                                        size="sm"
                                        w="56px"
                                        onClick={() => setShow(!show)}
                                    >
                                        {show ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
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
                                onClick={handleLogin}
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
                    transform: `rotate(${rotateDeg}deg) translateX(calc(-${shiftDis}vw)) translateY(calc(${shiftDis}vw))`,
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
                    transform: `rotate(${rotateDeg}deg) translateX(calc(${shiftDis}vw)) translateY(calc(-${shiftDis}vw))`,
                }}
                transition="transform 0.3s ease"
                zIndex="-1"
            />
        </Center>
    );
};

export default Login;
