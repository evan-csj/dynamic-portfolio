import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Heading,
    Box,
    Flex,
    Button,
    Select,
    FormControl,
    FormLabel,
    // FormErrorMessage,
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
    const navigate = useNavigate();
    const [userData, setUserData] = useState(undefined);
    const [type, setType] = useState('');
    const [amount, setAmount] = useState('');
    const [numberValue, setNumberValue] = useState(-1);
    const [account, setAccount] = useState('');
    const title = type === 'deposit' ? 'Deposit' : type === 'withdraw' ? 'Withdraw' : 'Funding';
    const handleTypeChange = event => setType(event.target.value);
    const handleAccountChange = event => setAccount(event.target.value);
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
        <Flex className="flex-col" px={4} pt={12} gap={8}>
            <Heading size="3xl">{title}</Heading>
            <FormControl>
                <FormLabel>Action</FormLabel>
                <Select placeholder="Select option" isRequired onChange={handleTypeChange}>
                    <option value="deposit">Deposit</option>
                    <option value="withdraw">Withdraw</option>
                </Select>
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
                <Select placeholder="Select option" isRequired onChange={handleAccountChange}>
                    <option value="usd">USD</option>
                    <option value="cad">CAD</option>
                </Select>
                <Box h={8} />
                <Button variant="submit" type="submit" w="100%" onClick={handleSubmit}>
                    Submit
                </Button>
            </FormControl>
            <Heading>Your Balance</Heading>
            <StatGroup>
                <Stat>
                    <StatLabel>USD Account</StatLabel>
                    <StatNumber>${userData ? userData.cash_usd : 0}</StatNumber>
                </Stat>

                <Stat>
                    <StatLabel>CAD Account</StatLabel>
                    <StatNumber>${userData ? userData.cash_cad : 0}</StatNumber>
                </Stat>
            </StatGroup>
        </Flex>
    );
}

export default FundingForm;
