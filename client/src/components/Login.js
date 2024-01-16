import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
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
    Spinner,
    SkeletonCircle,
    Skeleton,
} from '@chakra-ui/react';
import { checkUserPassword } from '../global/axios';
import logo from '../assets/logo.svg';
import githubIcon from '../assets/GitHub_Icon.png';
import githubLogo from '../assets/GitHub_Logo.png';
import googleIcon from '../assets/Google_Icon.png';
import googleLogo from '../assets/Google_Logo.png';
import '../styles/global.scss';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Login = props => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isUsernameCorrect, setIsUsernameCorrect] = useState(true);
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(true);
    const [show, setShow] = useState(false);
    const isConnect = props.wsStatus === 'Open';
    const rotateDeg = 25;
    const shiftDis = 20;

    const handleChange = (event, setFc) => {
        const input = event.target.value;
        const noSpace = input.replace(' ', '');
        setFc(noSpace);
        setIsUsernameCorrect(true);
        setIsPasswordCorrect(true);
    };

    const handleLogin = async () => {
        if (username === '' || password === '' || !isConnect) return;
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

    useEffect(() => {
        props.unsubscribeAll();
        const urlString = window.location.hash;
        const tokenString = urlString.split('?token=')[1];
        console.log(tokenString);
        if (tokenString) {
            sessionStorage.setItem('JWT', tokenString);
            navigate('/profile');
        }

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
                                cursor={isConnect ? 'pointer' : 'wait'}
                            >
                                {isConnect ? <>Login</> : <Spinner size="md" />}
                            </Button>
                            <Flex
                                w="100%"
                                rowGap={4}
                                direction={{ base: 'column', md: 'row' }}
                                flexWrap="wrap"
                            >
                                <Center
                                    flex="1"
                                    cursor={isConnect ? 'pointer' : 'wait'}
                                >
                                    {isConnect ? (
                                        <NavLink
                                            to={`${SERVER_URL}/auth/google`}
                                        >
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
                                    ) : (
                                        <Flex
                                            direction="row"
                                            gap="2"
                                            alignItems="center"
                                        >
                                            <SkeletonCircle h={8} />

                                            <Skeleton
                                                h={8}
                                                w={28}
                                                borderRadius={8}
                                            />
                                        </Flex>
                                    )}
                                </Center>

                                <Center
                                    flex="1"
                                    cursor={isConnect ? 'pointer' : 'wait'}
                                >
                                    {isConnect ? (
                                        <NavLink
                                            to={`${SERVER_URL}/auth/github`}
                                        >
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
                                    ) : (
                                        <Flex
                                            direction="row"
                                            gap="2"
                                            alignItems="center"
                                        >
                                            <SkeletonCircle h={8} />

                                            <Skeleton
                                                h={8}
                                                w={28}
                                                borderRadius={8}
                                            />
                                        </Flex>
                                    )}
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
