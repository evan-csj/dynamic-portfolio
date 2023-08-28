import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
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
    const [isUsernameCorrect, setIsUsernameCorrect] = useState(true);
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(true);
    const [show, setShow] = useState(false);
    const rotateDeg = 25;
    const shiftDis = 20;
    const google = window.google;
    const GOOGLE_ID = process.env.REACT_APP_GOOGLE_ID;

    const handleChange = (event, setFc) => {
        const input = event.target.value;
        const noSpace = input.replace(' ', '');
        setFc(noSpace);
        setIsUsernameCorrect(true);
        setIsPasswordCorrect(true);
    };

    const handleLogin = async () => {
        if (username === '' || password === '') return;
        const response = await checkUserPassword({
            username: username,
            password: password,
        });
        const validatedUsername = username.toLowerCase();

        if (response.status === 404) setIsUsernameCorrect(false);
        if (response.status === 403) setIsPasswordCorrect(false);
        if (response.status === 200) {
            setIsUsernameCorrect(true);
            setIsPasswordCorrect(true);
            sessionStorage.setItem('userId', validatedUsername);
            sessionStorage.setItem('authToken', response.data);
            navigate('/profile');
            props.login(validatedUsername);
        }
    };

    const handleGoogleLogin = response => {
        console.log(jwt_decode(response.credential));
    };

    useEffect(() => {
        props.unsubscribeAll();
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        google.accounts.id.initialize({
            client_id: GOOGLE_ID,
            callback: handleGoogleLogin,
        });

        google.accounts.id.renderButton(
            document.getElementById('google-signin'),
            {
                type: 'standard',
                shape: 'pill',
                theme: 'outline',
                size: 'large',
                logo_alignment: 'left',
                width: '320px',
            }
        );
        // eslint-disable-next-line
    }, []);

    return (
        <Center
            h="100vh"
            w="100vw"
            bg="light.white"
            overflow="hidden"
            zIndex="20"
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
                            <Box h="16px" />
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
                                        bg="light.black"
                                        color="light.white"
                                        borderWidth="2px"
                                        borderStyle="solid"
                                        borderColor="light.black"
                                        _hover={{}}
                                        _active={{
                                            bg: 'light.white',
                                            color: 'light.black',
                                        }}
                                        onMouseDown={() => setShow(true)}
                                        onMouseUp={() => setShow(false)}
                                    >
                                        {show ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Flex
                            w="100%"
                            gap="16px"
                            direction="column"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            {/* <Button
                                flex="1"
                                color="light.navy"
                                borderColor="light.navy"
                                borderWidth="2px"
                                borderStyle="solid"
                                bg="light.white"
                                _hover={{ bg: 'light.silver' }}
                            >
                                <NavLink to={'/signup'}>Sign Up</NavLink>
                            </Button> */}
                            <Button
                                w="100%"
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
                            <Box id="google-signin"></Box>
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
