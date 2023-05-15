import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import {
    Box,
    Flex,
    Center,
    Button,
    Grid,
    GridItem,
    FormControl,
    FormHelperText,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon, CheckIcon } from '@chakra-ui/icons';
import { getPortfolio, getSymbols, postTrading, getRTPrice } from '../../global/axios';
import PortfolioItem from './PortfolioItem';
import '../../styles/global.scss';

function Portfolio(props) {
    const userData = props.user;
    const navigate = useNavigate();
    const [portfolioList, setPortfolioList] = useState([]);
    const [availablePct, setAvailablePct] = useState(0);
    const [searchTicker, setSearchTicker] = useState('');
    const [totalPct, setTotalPct] = useState(100);
    const [existing, setExising] = useState(false);
    const [amount, setAmount] = useState('');
    const [numberValue, setNumberValue] = useState(-1);
    const symbolOptions = useRef([]);
    const updatePct = (ticker, value) => {
        const newPortfolio = [...portfolioList];
        let newAvailablePct = 100;
        let newTotal = 0;
        newPortfolio.map(item => {
            if (item.ticker === ticker) {
                item.percentage = value;
            }
            newAvailablePct -= item.percentage;
            newTotal += item.percentage;
        });
        setPortfolioList(newPortfolio);
        setAvailablePct(newAvailablePct);
        setTotalPct(newTotal);
    };

    const findTicker = selected => {
        setSearchTicker(selected.value);
        for (let i = 0; i < portfolioList.length; i++) {
            if (portfolioList[i].ticker === selected.value) {
                setExising(true);
                return;
            }
        }
        setExising(false);
        return;
    };

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

    const addTicker = () => {
        if (searchTicker !== '' && !existing && totalPct !== 100) {
            const newPortfolio = {
                ticker: searchTicker,
                percentage: 1,
            };
            const newPortfolioList = [...portfolioList, newPortfolio];
            setPortfolioList(newPortfolioList);
            setSearchTicker('');
        }
    };

    const deleteTicker = ticker => {
        let newPortfolioList = [];
        portfolioList.map(item => {
            if (item.ticker !== ticker) newPortfolioList.push(item);
        });
        setPortfolioList(newPortfolioList);
    };

    const enoughFund = () => {
        if (!userData) return;
        if (numberValue > userData.cashUSD) {
            return false;
        } else {
            return true;
        }
    };

    const notZero = numberValue <= 0 ? false : true;

    const handleSubmitChange = () => {
        if (!enoughFund() || !notZero) return;
        portfolioList.map(async item => {
            const response = await getRTPrice(item.ticker);
            const priceRT = response.data.price;
            const shares = (numberValue * item.percentage) / 100 / priceRT;
            const newTrade = {
                user_id: props.userId,
                ticker: item.ticker,
                price: priceRT,
                shares: shares,
                type: 'buy',
                order_status: 'pending',
                currency: 'usd',
            };
            await postTrading(newTrade);
        });
        navigate('/history');
    };

    useEffect(() => {
        getPortfolio(props.userId).then(response => {
            setPortfolioList(response.data);
        });
    }, []);

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

    return (
        <Flex className="flex-col" pt={4}>
            <FormControl key={portfolioList}>
                <Flex w="100%" gap={4} justifyContent="space-between">
                    <Box flex="1" zIndex={3}>
                        <Select
                            placeholder="Type Symbol"
                            options={symbolOptions.current}
                            isRequired
                            onChange={findTicker}
                        ></Select>
                    </Box>

                    <Center
                        bg="light.black"
                        boxSize="38px"
                        justifyItems="center"
                        alignItems="center"
                        cursor="pointer"
                        borderRadius={4}
                        onClick={addTicker}
                    >
                        <AddIcon color="light.white" />
                    </Center>
                </Flex>
                {existing ? (
                    <FormHelperText color="light.red">Already existing!</FormHelperText>
                ) : totalPct === 100 && searchTicker !== '' ? (
                    <FormHelperText color="light.red">
                        No space for new investment. Please reduce some allocation!
                    </FormHelperText>
                ) : (
                    <></>
                )}
                <Box h={4} />
                <Flex gap={4}>
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
                    <Button
                        variant="distribute"
                        type="submit"
                        w="100%"
                        onClick={handleSubmitChange}
                    >
                        Distribute
                    </Button>
                </Flex>
            </FormControl>

            <Grid className="grid-portfolio">
                <GridItem fontWeight="bold">Total</GridItem>
                <GridItem></GridItem>
                <GridItem textAlign="right">{totalPct}%</GridItem>
            </Grid>
            {portfolioList.map((item, index) => {
                return (
                    <PortfolioItem
                        key={index}
                        ticker={item.ticker}
                        pct={item.percentage}
                        update={updatePct}
                        delete={deleteTicker}
                        max={availablePct + item.percentage}
                    />
                );
            })}
        </Flex>
    );
}

export default Portfolio;
