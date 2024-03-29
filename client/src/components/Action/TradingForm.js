import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import {
    Heading,
    Box,
    Flex,
    Stack,
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
import { isMarketOpen } from '../../global/time';
import Balance from './Balance';
import '../../styles/global.scss';
// import useWebSocket from 'react-use-websocket';

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
    const [userId, setUserId] = useState(null);
    const [userData, setUserData] = useState(undefined);
    const [type, setType] = useState('');
    const [symbol, setSymbol] = useState('');
    const [shares, setShares] = useState(0);
    const [quantity, setQuantity] = useState('');
    const [currentPrice, setCurrentPrice] = useState(0);
    const [currency, setCurrency] = useState('');
    const symbolOptions = useRef([]);
    const holdings = useRef(undefined);
    const { lastMessage, sendMessage, setSubscribe, unsubscribeAll } = props;

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
        setSubscribe([selected.value]);
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
                userId,
                ticker: symbol,
                price: currentPrice,
                shares: Number(quantity),
                type,
                orderStatus: 'pending',
                currency,
            };
            postTrading(newTrade);
            props.closeDrawer();
            if (props.toggle) {
                props.updateToggle(false);
            } else {
                props.updateToggle(true);
            }
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
        unsubscribeAll();
        const userIdSession = sessionStorage.getItem('userId');
        const username = userIdSession ?? '';
        setUserId(username);

        getUser(username).then(response => {
            setUserData(response.data);
        });
        getHoldings(username).then(response => {
            holdings.current = response.data;
        });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (isMarketOpen() && lastMessage !== null) {
            const json = JSON.parse(lastMessage.data);
            setCurrentPrice(parseFloat(json.price));
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
            px={{ base: '16px', lg: '32px', xl: '24px' }}
            mx={{ xl: '0' }}
            w={{ xl: '100%' }}
            pt={12}
            gap={8}
        >
            <Heading size="3xl">{title}</Heading>
            <FormControl>
                <Stack spacing={8}>
                    <Box>
                        <FormLabel>Type</FormLabel>
                        <Select
                            placeholder="Select Type"
                            options={typeOptions}
                            isRequired
                            onChange={handleTypeChange}
                        ></Select>
                    </Box>

                    <Box>
                        <FormLabel>Symbol</FormLabel>
                        <Select
                            placeholder="Type Symbol"
                            options={symbolOptions.current}
                            isRequired
                            onChange={handleSymbolChange}
                        ></Select>
                        {
                            <FormHelperText>
                                Current price: ${currentPrice} {currency} /
                                Position: {shares} shares
                            </FormHelperText>
                        }
                    </Box>

                    <Box>
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
                    </Box>

                    <Box>
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
                    </Box>
                </Stack>
            </FormControl>
            <Balance userData={userData} />
        </Flex>
    );
};

export default TradingForm;
