import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Heading,
    Box,
    Flex,
    Stack,
    FormControl,
    FormLabel,
    FormHelperText,
    Input,
    Button,
} from '@chakra-ui/react';
import { getUser, updateUserData } from '../global/axios';

const SignUp = props => {
    const navigate = useNavigate();
    const [oldUserId, setOldUserId] = useState('');
    const [newUserId, setNewUserId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isDuplicate, setIsDuplicate] = useState(false);

    const handleSave = () => {
        if (newUserId && firstName && lastName) {
            const newUserData = {
                oldUserId,
                newUserId,
                firstName,
                lastName,
            };

            updateUserData(newUserData).then(response => {
                if (response.status === 403) {
                    setIsDuplicate(true);
                } else {
                    navigate('/profile');
                }
            });
        }
    };

    const handleIdChange = event => {
        const input = event.target.value;
        setNewUserId(input);
    };

    const handleFirstNameChange = event => {
        const input = event.target.value;
        setFirstName(input);
    };

    const handleLastNameChange = event => {
        const input = event.target.value;
        setLastName(input);
    };

    useEffect(() => {
        props.unsubscribeAll();
        const userIdSession = sessionStorage.getItem('userId');
        const username = userIdSession ?? '';

        getUser(username).then(response => {
            if (response.status === 200) {
                setFirstName(response.data.first_name);
                setLastName(response.data.last_name);
                setOldUserId(response.data.id);
                setNewUserId(response.data.id);
            } else {
                navigate('/');
            }
        });
        // eslint-disable-next-line
    }, []);

    return (
        <Flex
            direction="column"
            px={{ base: '24px', lg: '32px', xl: '0' }}
            mx={{ xl: 'auto' }}
            w={{ xl: '1020px' }}
            pt={12}
            gap={8}
        >
            <Heading size="3xl">Sign Up</Heading>
            <FormControl
                w={{ base: '100%', md: '320px' }}
                alignSelf={{ base: 'flex-start', lg: 'center' }}
            >
                <Stack spacing={8}>
                    <Box>
                        <FormLabel>Username</FormLabel>
                        <Input
                            placeholder={oldUserId}
                            isRequired
                            maxLength="10"
                            onChange={handleIdChange}
                        />
                        {isDuplicate ? (
                            <FormHelperText color="light.red">
                                User exists! Please try another one!
                            </FormHelperText>
                        ) : (
                            <></>
                        )}
                    </Box>
                    <Box>
                        <FormLabel>First Name</FormLabel>
                        <Input
                            placeholder={firstName}
                            isRequired
                            maxLength="20"
                            onChange={handleFirstNameChange}
                        />
                    </Box>
                    <Box>
                        <FormLabel>Last Name</FormLabel>
                        <Input
                            placeholder={lastName}
                            isRequired
                            maxLength="20"
                            onChange={handleLastNameChange}
                        />
                    </Box>
                    <Button
                        variant="submit"
                        type="submit"
                        w="100%"
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                </Stack>
            </FormControl>
        </Flex>
    );
};

export default SignUp;
