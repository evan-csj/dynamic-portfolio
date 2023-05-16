import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import {
    Heading,
    Box,
    Flex,
    Button,
    FormControl,
    FormLabel,
    FormHelperText,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    StatGroup,
    StatLabel,
    Stat,
    StatNumber,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { getUser, postFunding } from '../global/axios';
import '../styles/global.scss';

function FundingForm(props) {
    const typeOptions = [
        {
            value: 'deposit',
            label: 'Deposit',
        },
        {
            value: 'withdraw',
            label: 'Withdraw',
        },
    ];
    const accountOptions = [
        {
            value: 'usd',
            label: 'USD',
        },
        {
            value: 'cad',
            label: 'CAD',
        },
    ];
    const navigate = useNavigate();
    const [userData, setUserData] = useState(undefined);
    const [type, setType] = useState('');
    const [amount, setAmount] = useState('');
    const [numberValue, setNumberValue] = useState(-1);
    const [account, setAccount] = useState('');
    const title = type === 'deposit' ? 'Deposit' : type === 'withdraw' ? 'Withdraw' : 'Funding';
    const handleTypeChange = selected => setType(selected.value);
    const handleAccountChange = selected => setAccount(selected.value);
    const handleAmountChange = event => {
        const input = event.target.value;
        const pureNumber = input.replace(/\D/g, '');
        if (input !== '') {
            setNumberValue(parseInt(pureNumber));
        } else {
            setNumberValue(0);
        }

        const len = pureNumber.length;
        const pureNumberArray = pureNumber.split('');
        const n = parseInt((len - 1) / 3);

        if (len >= 4) {
            for (let i = 0; i < n; i++) {
                pureNumberArray.splice(-3 * (n - i), 0, ',');
            }
        }
        const currency = pureNumberArray.join('');
        setAmount(currency);
    };

    const enoughFund = () => {
        if (type === 'withdraw') {
            if (account === 'usd' && numberValue > userData.cash_usd) return false;
            if (account === 'cad' && numberValue > userData.cash_cad) return false;
        }
        return true;
    };

    const notZero = numberValue <= 0 ? false : true;

    useEffect(() => {
        getUser(props.userId).then(response => {
            setUserData(response.data);
        });
    }, [props.userId]);

    const handleSubmit = () => {
        if (type !== '' && account !== '' && notZero && enoughFund()) {
            const newFunding = {
                user_id: props.userId,
                amount: numberValue,
                type: type,
                currency: account,
            };
            postFunding(newFunding);
            navigate('/profile');
        }
    };

    return (
        <Flex className="flex-col" px={{ base: '16px', lg: '32px' }} pt={12} gap={8}>
            <Heading size="3xl">{title}</Heading>
            <FormControl>
                <FormLabel>Action</FormLabel>
                <Select
                    placeholder="Select Action"
                    options={typeOptions}
                    isRequired
                    onChange={handleTypeChange}
                ></Select>
                <Box h={8} />
                <FormLabel>Amount</FormLabel>
                <InputGroup>
                    <InputLeftElement pointerEvents="none" color="light.grey" children="$" />
                    <Input
                        placeholder="Enter amount"
                        name="amount"
                        value={amount}
                        maxLength="13"
                        onChange={handleAmountChange}
                    />
                    <InputRightElement
                        children={
                            enoughFund() && notZero ? (
                                <CheckIcon color="light.green" />
                            ) : (
                                <CloseIcon color="light.red" />
                            )
                        }
                    />
                </InputGroup>
                {!enoughFund() ? (
                    <FormHelperText color="light.red">
                        Fund is not enough to withdraw
                    </FormHelperText>
                ) : !notZero ? (
                    <FormHelperText color="light.red">Don't enter 0</FormHelperText>
                ) : (
                    <></>
                )}
                <Box h={8} />
                <FormLabel>Account</FormLabel>
                <Select
                    placeholder="Select Account"
                    options={accountOptions}
                    isRequired
                    onChange={handleAccountChange}
                ></Select>
                <Box h={8} />
                <Button variant="submit" type="submit" w="100%" onClick={handleSubmit}>
                    Submit
                </Button>
            </FormControl>
            <Heading>Your Balance</Heading>
            <StatGroup>
                <Stat>
                    <StatLabel>USD Account</StatLabel>
                    <StatNumber>${userData ? userData.cash_usd.toFixed(2) : 0}</StatNumber>
                </Stat>

                <Stat>
                    <StatLabel>CAD Account</StatLabel>
                    <StatNumber>${userData ? userData.cash_cad.toFixed(2) : 0}</StatNumber>
                </Stat>
            </StatGroup>
        </Flex>
    );
}

export default FundingForm;
