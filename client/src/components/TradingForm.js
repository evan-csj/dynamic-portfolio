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
    Input,
    InputGroup,
    StatGroup,
    StatLabel,
    Stat,
    StatNumber,
} from '@chakra-ui/react';
import { getUser, postFunding } from '../global/axios';
import '../styles/global.scss';

function TradingForm(props) {
    const typeOptions = [
        {
            value: 'buy',
            label: 'Buy',
        },
        {
            value: 'sell',
            label: 'Sell',
        },
    ];
    const navigate = useNavigate();
    const [userData, setUserData] = useState(undefined);
    const [type, setType] = useState('');
    const [symbol, setSymbol] = useState('');
    const [quantity, setQuantity] = useState('');

    const title = type === 'buy' ? 'Buy' : type === 'sell' ? 'Sell' : 'Trading';
    const handleTypeChange = selected => setType(selected.value);
    // const handleSymbolChange = event => {
    //     const input = event.target.value;
    //     setSymbol(input.replace(/[^A-Za-z]/g, '').toUpperCase());
    //     clearTimeout(typeTimer);
    //     typeTimer = setTimeout(() => console.log('hello'), '2000');
    // };
    const handleQuantityChange = event => {
        const input = event.target.value;
        const pureNumber = input.replace(/\D/g, '');
        setQuantity(pureNumber);
    };

    useEffect(() => {
        getUser(props.userId).then(response => {
            setUserData(response.data);
        });
    }, [props.userId]);

    return (
        <Flex className="flex-col" px={4} pt={12} gap={8}>
            <Heading size="3xl">{title}</Heading>
            <FormControl>
                <FormLabel>Type</FormLabel>
                <Select
                    placeholder="Select option"
                    options={typeOptions}
                    isRequired
                    onChange={handleTypeChange}
                ></Select>
                <Box h={8} />
                <FormLabel>Symbol</FormLabel>

                {/* <InputGroup>
                    <Input
                        placeholder="Enter Symbol"
                        name="symbol"
                        value={symbol}
                        maxLength="5"
                        onChange={handleSymbolChange}
                    />
                </InputGroup> */}
                <Box h={8} />
                <FormLabel>Quantity</FormLabel>
                <InputGroup>
                    <Input
                        placeholder="Enter Quantity"
                        name="quantity"
                        value={quantity}
                        maxLength="10"
                        onChange={handleQuantityChange}
                    />
                </InputGroup>
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

export default TradingForm;
