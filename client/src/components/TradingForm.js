import React, { useState, useEffect, useRef } from 'react';
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
    StatGroup,
    StatLabel,
    Stat,
    StatNumber,
} from '@chakra-ui/react';
import { getUser, getSymbols, getRTPrice, getHoldings, postTrading } from '../global/axios';
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
    const [currentPrice, setCurrentPrice] = useState(0);
    const symbolOptions = useRef([]);
    const holdings = useRef([]);

    const title = type === 'buy' ? 'Buy' : type === 'sell' ? 'Sell' : 'Trading';
    const handleTypeChange = selected => setType(selected.value);
    const handleSymbolChange = selected => {
        getRTPrice(selected.value).then(response => {
            setCurrentPrice(response.data.price);
        });
        setSymbol(selected.value);
    };

    // const handleSymbolChange = event => {
    //     const input = event.target.value;
    //     setSymbol(input.replace(/[^A-Za-z]/g, '').toUpperCase());
    // };
    const handleQuantityChange = event => {
        const input = event.target.value;
        const pureNumber = input.replace(/\D/g, '');
        setQuantity(pureNumber);
    };
    const handleSubmit = () => {
        if (
            enoughFund() &&
            enoughShares() &&
            notZero &&
            type !== '' &&
            symbol !== '' &&
            quantity !== ''
        ) {
            const newTrade = {
                user_id: props.userId,
                ticker: symbol,
                price: currentPrice,
                shares: Number(quantity),
                type: type,
                order_status: 'pending',
                currency: 'usd',
            };
            postTrading(newTrade);
            navigate('/profile');
        }
    };

    useEffect(() => {
        getSymbols().then(response => {
            const symbols = response.data;
            const formattedSymbols = symbols.map(item => {
                return {
                    value: item.symbol,
                    label: item.symbol,
                };
            });
            symbolOptions.current = formattedSymbols;
        });
        getHoldings(props.userId).then(response => {
            holdings.current = response.data;
        });
    }, []);

    useEffect(() => {
        getUser(props.userId).then(response => {
            setUserData(response.data);
        });
    }, [props.userId]);

    const enoughShares = () => {
        const holdingArray = holdings.current;
        if (type === 'sell' && symbol !== '' && quantity !== '') {
            for (let i = 0; i < holdingArray.length; i++) {
                if (holdingArray[i].ticker === symbol) {
                    if (
                        holdingArray[i].buy_shares - holdingArray[i].sell_shares >=
                        Number(quantity)
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
            return false;
        } else {
            return true;
        }
    };

    const enoughFund = () => {
        if (type === 'buy' && symbol !== '' && quantity !== '') {
            const fundRequired = Number(quantity) * currentPrice;
            if (userData.cash_usd >= fundRequired) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    };

    const notZero = () => {
        if (quantity === '') {
            return true;
        } else {
            if (Number(quantity) <= 0) {
                return false;
            } else {
                return true;
            }
        }
    };

    return (
        <Flex className="flex-col" px={4} pt={12} gap={8}>
            <Heading size="3xl">{title}</Heading>
            <FormControl>
                <FormLabel>Type</FormLabel>
                <Select
                    placeholder="Select Type"
                    options={typeOptions}
                    isRequired
                    onChange={handleTypeChange}
                ></Select>
                <Box h={8} />
                <FormLabel>Symbol</FormLabel>
                <Select
                    placeholder="Type Symbol"
                    options={symbolOptions.current}
                    isRequired
                    onChange={handleSymbolChange}
                ></Select>
                {/* <InputGroup>
                    <Input
                        placeholder="Enter Symbol"
                        name="symbol"
                        value={symbol}
                        maxLength="5"
                        onChange={handleSymbolChange}
                    />
                </InputGroup> */}
                {<FormHelperText>Current price: ${currentPrice} USD</FormHelperText>}
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
                {!notZero() ? (
                    <FormHelperText color="light.red">Don't enter 0!</FormHelperText>
                ) : (
                    <></>
                )}
                <Box h={8} />
                <Button variant="submit" type="submit" w="100%" onClick={handleSubmit}>
                    Submit
                </Button>
                {!enoughShares() ? (
                    <FormHelperText color="light.red">Not enough shares to sell</FormHelperText>
                ) : !enoughFund() ? (
                    <FormHelperText color="light.red">Not enough fund to buy</FormHelperText>
                ) : (
                    <></>
                )}
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

export default TradingForm;
