import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import {
    Flex,
    Spacer,
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
import githubIcon from '../assets/GitHub_Icon.png';
import githubLogo from '../assets/GitHub_Logo.png';
import googleIcon from '../assets/Google_Icon.png';
import googleLogo from '../assets/Google_Logo.png';
import '../styles/global.scss';

import axios from 'axios';
import { GitHubLogin } from '../styles/icons';
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

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

    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profileData, setProfileData] = useState(null);

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
            sessionStorage.setItem('JWT', response.data);
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

    // useEffect(() => {
    //     google.accounts.id.initialize({
    //         client_id: GOOGLE_ID,
    //         callback: handleGoogleLogin,
    //     });

    //     google.accounts.id.renderButton(
    //         document.getElementById('google-signin'),
    //         {
    //             type: 'standard',
    //             shape: 'pill',
    //             theme: 'outline',
    //             size: 'large',
    //             logo_alignment: 'left',
    //             width: '320px',
    //         }
    //     );
    //     // eslint-disable-next-line
    // }, []);

    // useEffect(() => {
    //     // Send a GET request for profile information
    //     // If user is currently logged in, we will get profile data, if they are not logged in, we will get 401 (Unauthorized) that we can handle in `.catch`
    //     // Note that we need to use `withCredentials` in order to pass the cookie to a server
    //     axios
    //         .get(`${SERVER_URL}/auth/profile`, { withCredentials: true })
    //         .then(res => {
    //             // Update the state: done authenticating, user is logged in, set the profile data
    //             setIsAuthenticating(false);
    //             setIsLoggedIn(true);
    //             setProfileData(res.data);
    //         })
    //         .catch(err => {
    //             // If we are getting back 401 (Unauthorized) back from the server, means we need to log in
    //             if (err.response.status === 401) {
    //                 // Update the state: done authenticating, user is not logged in
    //                 setIsAuthenticating(false);
    //                 setIsLoggedIn(false);
    //             } else {
    //                 console.log('Error authenticating', err);
    //             }
    //         });
    // }, []);

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
                    w="100%"
                    mx={8}
                    p="32px"
                    bg="light.white"
                    borderRadius="24px"
                    boxShadow="2xl"
                >
                    <Flex
                        direction="column"
                        alignItems="center"
                        gap={0}
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
                            mt={6}
                            gap={6}
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
                            <Flex
                                w="100%"
                                rowGap={4}
                                direction={{ base: 'column', md: 'row' }}
                                flexWrap="wrap"
                            >
                                <Center flex="1">
                                    <NavLink to={`${SERVER_URL}/auth/google`}>
                                        <Flex
                                            direction="row"
                                            gap={1}
                                            alignItems="flex-end"
                                        >
                                            <Image
                                                h={8}
                                                src={googleIcon}
                                                alt="google-icon"
                                            />
                                            <Image
                                                h={7}
                                                src={googleLogo}
                                                alt="google-logo"
                                            />
                                        </Flex>
                                    </NavLink>
                                </Center>

                                <Center flex="1">
                                    <NavLink to={`${SERVER_URL}/auth/github`}>
                                        <Flex
                                            direction="row"
                                            gap="0"
                                            alignItems="center"
                                        >
                                            <Image
                                                h={8}
                                                src={githubIcon}
                                                alt="github-icon"
                                            />
                                            <Image
                                                h={5}
                                                src={githubLogo}
                                                alt="github-logo"
                                            />
                                        </Flex>
                                    </NavLink>
                                </Center>
                            </Flex>
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
