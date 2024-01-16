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
    const [oldUserId, setOldUserId] = useState(' ');
    const [newUserId, setNewUserId] = useState(' ');
    const [firstName, setFirstName] = useState(' ');
    const [lastName, setLastName] = useState(' ');
    const [isNew, setIsNew] = useState(false);
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
        const noSpace = input.replace(/\s/g, '');
        setNewUserId(noSpace);
        setIsDuplicate(false);
    };

    const handleFirstNameChange = event => {
        const input = event.target.value;
        const noSpace = input.replace(/\s/g, '');
        setFirstName(noSpace);
    };

    const handleLastNameChange = event => {
        const input = event.target.value;
        const noSpace = input.replace(/\s/g, '');
        setLastName(noSpace);
    };

    useEffect(() => {
        props.unsubscribeAll();
        const urlString = window.location.hash;
        try {
            const paramString = urlString.split('?')[1];
            const searchParams = new URLSearchParams(paramString);
            for (const [key, value] of searchParams.entries()) {
                if (key === 'user') sessionStorage.setItem('userId', value);
                if (key === 'token') sessionStorage.setItem('JWT', value);
            }
        } catch (error) {}

        const userIdSession = sessionStorage.getItem('userId');
        const username = userIdSession ?? '';

        getUser(username).then(response => {
            if (response.status === 200) {
                const {
                    first_name: firstName,
                    last_name: lastName,
                    id,
                    is_new: isNew,
                } = response.data;
                setFirstName(firstName);
                setLastName(lastName);
                setOldUserId(id);
                setNewUserId(id);
                setIsNew(isNew);
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
            <Heading size="3xl">{isNew ? 'Sign Up' : 'Update'}</Heading>
            <FormControl
                w={{ base: '100%', md: '320px' }}
                alignSelf={{ base: 'flex-start', lg: 'center' }}
            >
                <Stack spacing={2}>
                    <Box>
                        <FormLabel>Username</FormLabel>
                        <Input
                            placeholder={'User ID'}
                            value={newUserId}
                            isRequired
                            maxLength="20"
                            onChange={handleIdChange}
                        />
                        {isDuplicate ? (
                            <FormHelperText color="light.red">
                                User exists! Please try another one!
                            </FormHelperText>
                        ) : newUserId === '' ? (
                            <FormHelperText color="light.red">
                                Don't leave it empty!
                            </FormHelperText>
                        ) : (
                            <FormHelperText color="transparent">
                                Placeholder
                            </FormHelperText>
                        )}
                    </Box>
                    <Box>
                        <FormLabel>First Name</FormLabel>
                        <Input
                            placeholder={'First Name'}
                            value={firstName}
                            isRequired
                            maxLength="20"
                            onChange={handleFirstNameChange}
                        />
                    </Box>
                    {firstName === '' ? (
                        <FormHelperText color="light.red">
                            Don't leave it empty!
                        </FormHelperText>
                    ) : (
                        <FormHelperText color="transparent">
                            Placeholder
                        </FormHelperText>
                    )}
                    <Box>
                        <FormLabel>Last Name</FormLabel>
                        <Input
                            placeholder={'Last Name'}
                            value={lastName}
                            isRequired
                            maxLength="20"
                            onChange={handleLastNameChange}
                        />
                    </Box>
                    {lastName === '' ? (
                        <FormHelperText color="light.red">
                            Don't leave it empty!
                        </FormHelperText>
                    ) : (
                        <FormHelperText color="transparent">
                            Placeholder
                        </FormHelperText>
                    )}
                    <Box pt={2}>
                        <Button
                            variant="submit"
                            type="submit"
                            w="100%"
                            onClick={handleSave}
                        >
                            Save
                        </Button>
                    </Box>
                </Stack>
            </FormControl>
        </Flex>
    );
};

export default SignUp;
