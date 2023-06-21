import React, { useState, useEffect, useRef, useCallback } from 'react';
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
} from '@chakra-ui/react';
import {
    getUser,
    getSymbols,
    getLastPrice,
    getHoldings,
    postTrading,
    getCompanyProfile,
    putSymbolInfo,
} from '../../global/axios';
import Balance from './Balance';
import '../../styles/global.scss';
import useWebSocket from 'react-use-websocket';

const TradingForm = props => {
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
    const [shares, setShares] = useState(0);
    const [quantity, setQuantity] = useState('');
    const [currentPrice, setCurrentPrice] = useState(0);
    const [currency, setCurrency] = useState('');
    const symbolOptions = useRef([]);
    const holdings = useRef(undefined);

    const FINNHUB_KEY = process.env.REACT_APP_FINNHUB_KEY;
    const socketUrl = `wss://ws.finnhub.io?token=${FINNHUB_KEY}`;
    const { sendMessage, lastMessage } = useWebSocket(socketUrl, {
        onOpen: () => console.log('Link Start'),
        shouldReconnect: closeEvent => true,
    });

    const title = type === 'buy' ? 'Buy' : type === 'sell' ? 'Sell' : 'Trading';
    const handleTypeChange = selected => setType(selected.value);
    const handleSymbolChange = selected => {
        getLastPrice(selected.value).then(response => {
            setCurrentPrice(response.data.c);
        });
        getCompanyProfile(selected.value).then(response => {
            const {
                ticker,
                name,
                exchange,
                finnhubIndustry: sector,
                logo,
                currency,
            } = response.data;

            const updateSymbol = {
                ticker: ticker,
                name: name,
                exchange: exchange,
                sector: sector,
                logo: logo,
                currency: currency,
            };

            putSymbolInfo(updateSymbol);
            setCurrency(currency);
        });

        setSymbol(selected.value);
        if (symbol !== '') wsChange('unsubscribe', symbol);
        wsChange('subscribe', selected.value);
    };

    // const handleSymbolChange = event => {
    //     const input = event.target.value;
    //     setSymbol(input.replace(/[^A-Za-z]/g, '').toUpperCase());
    // };
    const handleQuantityChange = event => {
        const input = event.target.value;
        const period = input.split('.', 2);
        let intPart = period[0].replace(/\D/g, '');
        let fracPart;
        let fracNum = intPart;
        if (period.length > 1) {
            fracPart = period[1].replace(/\D/g, '');
            fracNum += '.' + fracPart;
        }
        setQuantity(fracNum);
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
                currency: currency,
            };
            postTrading(newTrade);
            props.changePage('profile');
            navigate('/profile');
        }
    };

    const wsChange = useCallback(
        (type, symbol) => {
            sendMessage(JSON.stringify({ type: type, symbol: symbol }));
        },
        [sendMessage]
    );

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
    }, []);

    useEffect(() => {
        if (holdings && symbol !== '') {
            const holdingArray = holdings.current;
            for (let i = 0; i < holdingArray.length; i++) {
                if (holdingArray[i].ticker === symbol) {
                    const shares =
                        holdingArray[i].buy_shares -
                        holdingArray[i].sell_shares;
                    setShares(shares);
                    break;
                } else {
                    setShares(0);
                }
            }
        }
    }, [holdings, symbol]);

    useEffect(() => {
        getUser(props.userId).then(response => {
            setUserData(response.data);
        });
        getHoldings(props.userId).then(response => {
            holdings.current = response.data;
        });
    }, [props.userId]);

    useEffect(() => {
        if (lastMessage !== null) {
            const json = JSON.parse(lastMessage.data);
            const type = json.type;
            if (type === 'trade') {
                const data = json.data;
                const price = data[0].p;
                const symbol = data[0].s;
                console.log(symbol, price);
                setCurrentPrice(price);
            }
        }
    }, [lastMessage]);

    const enoughShares = () => {
        const holdingArray = holdings.current;
        if (type === 'sell' && symbol !== '' && quantity !== '') {
            for (let i = 0; i < holdingArray.length; i++) {
                if (holdingArray[i].ticker === symbol) {
                    const shares =
                        holdingArray[i].buy_shares -
                        holdingArray[i].sell_shares;
                    if (shares >= Number(quantity)) {
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
        <Flex
            className="flex-col"
            px={{ base: '16px', lg: '32px', xl: '0' }}
            mx={{ xl: 'auto' }}
            w={{ xl: '1020px' }}
            pt={12}
            gap={8}
        >
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
                {
                    <FormHelperText>
                        Current price: ${currentPrice} {currency} / Position: {shares}{' '}
                        shares
                    </FormHelperText>
                }
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
                    <FormHelperText color="light.red">
                        Don't enter 0!
                    </FormHelperText>
                ) : (
                    <></>
                )}
                <Box h={8} />
                <Button
                    variant="submit"
                    type="submit"
                    w="100%"
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
                {!enoughShares() ? (
                    <FormHelperText color="light.red">
                        Not enough shares to sell
                    </FormHelperText>
                ) : !enoughFund() ? (
                    <FormHelperText color="light.red">
                        Not enough fund to buy
                    </FormHelperText>
                ) : (
                    <></>
                )}
            </FormControl>
            <Balance userData={userData} />
        </Flex>
    );
};

export default TradingForm;
