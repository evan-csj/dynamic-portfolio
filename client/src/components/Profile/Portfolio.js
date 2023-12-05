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
    Spinner,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon, CheckIcon } from '@chakra-ui/icons';
import {
    putPortfolio,
    getSymbols,
    postTrading,
    getLastPrice,
} from '../../global/axios';
import PortfolioItem from './PortfolioItem';
import '../../styles/global.scss';

const jsonObj2Array = jsonObj => {
    let portfolioList = [];
    for (let key in jsonObj) {
        portfolioList.push({ ticker: key, percentage: jsonObj[key] });
    }
    return portfolioList;
};

const Portfolio = props => {
    const userData = props.user;
    const navigate = useNavigate();
    const [portfolioList, setPortfolioList] = useState([]);
    const [availablePct, setAvailablePct] = useState(0);
    const [searchTicker, setSearchTicker] = useState('');
    const [totalPct, setTotalPct] = useState(100);
    const [existing, setExising] = useState(false);
    const [amount, setAmount] = useState('');
    const [numberValue, setNumberValue] = useState(-1);
    const [save, setSave] = useState(true);
    const [processing, setProcessing] = useState(false);
    const symbolOptions = useRef([]);
    const updatePct = (ticker, value) => {
        const newPortfolio = [...portfolioList];
        let newAvailablePct = 100;
        let newTotal = 0;
        newPortfolio.forEach(item => {
            if (item.ticker === ticker) {
                item.percentage = value;
            }
            newAvailablePct -= item.percentage;
            newTotal += item.percentage;
        });
        setPortfolioList(newPortfolio);
        setAvailablePct(newAvailablePct);
        setTotalPct(newTotal);
        setSave(false);
    };

    const updatePortfolio = list => {
        let jsonObj = {};
        for (let i = 0; i < list.length; i++) {
            jsonObj[list[i].ticker] = list[i].percentage;
        }
        putPortfolio(props.userId, jsonObj);
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
            setSave(false);
        }
    };

    const deleteTicker = ticker => {
        let newTotal = 0;
        let newAvailablePct = 100;
        let newPortfolioList = [];
        portfolioList.forEach(item => {
            if (item.ticker !== ticker) {
                newPortfolioList.push(item);
                newTotal += item.percentage;
                newAvailablePct -= item.percentage;
            }
        });

        setAvailablePct(newAvailablePct);
        setPortfolioList(newPortfolioList);
        setTotalPct(newTotal);
        setSave(false);
    };

    const handleSaveChange = () => {
        setSave(true);
        updatePortfolio(portfolioList);
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

    const handleSubmitChange = async () => {
        if (!enoughFund() || !notZero || totalPct !== 100) return;
        setProcessing(true);
        for (let item of portfolioList) {
            const quote = await getLastPrice(item.ticker);
            const { c: price } = quote.data;
            const shares = (numberValue * item.percentage) / 100 / price;
            const sharesRound = Math.floor(shares * 1000) / 1000;

            const newTrade = {
                user_id: props.userId,
                ticker: item.ticker,
                price: price,
                shares: sharesRound,
                type: 'buy',
                order_status: 'pending',
                currency: 'USD',
            };

            if (sharesRound > 0) postTrading(newTrade);
        }

        props.changePage('history');
        navigate('/history');
    };

    useEffect(() => {
        if (userData) {
            let newTotal = 0;
            let newAvailablePct = 100;
            const list = jsonObj2Array(userData.dp);

            list.forEach(item => {
                newTotal += item.percentage;
                newAvailablePct -= item.percentage;
            });

            setPortfolioList(list);
            setAvailablePct(newAvailablePct);
            setTotalPct(newTotal);
        }
    }, [userData]);

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
            <FormControl key={portfolioList} zIndex="2">
                <Flex w="100%" gap={4} justifyContent="space-between">
                    <Box flex="1">
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
                    <FormHelperText color="light.red">
                        Already existing!
                    </FormHelperText>
                ) : totalPct === 100 && searchTicker !== '' ? (
                    <FormHelperText color="light.red">
                        No space for new investment. Please reduce some
                        allocation!
                    </FormHelperText>
                ) : (
                    <></>
                )}
                <Box h={4} />
                <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
                    <InputGroup>
                        <InputLeftElement
                            pointerEvents="none"
                            color="light.grey"
                            children="$"
                        />
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
                    <Flex gap={4} justifyContent="space-between">
                        <Button
                            variant="distribute"
                            type="submit"
                            w={{ base: '100%', md: '100px' }}
                            _hover={{}}
                            isDisabled={
                                totalPct === 100 &&
                                numberValue > 0 &&
                                enoughFund()
                                    ? false
                                    : true
                            }
                            onClick={handleSubmitChange}
                        >
                            {!processing ? (
                                'Distribute'
                            ) : (
                                <Spinner color="light.white" />
                            )}
                        </Button>
                        <Button
                            variant="distribute"
                            type="submit"
                            w={{ base: '100%', md: '100px' }}
                            onClick={handleSaveChange}
                            bg={save ? 'light.green' : 'light.red'}
                        >
                            {save ? 'Saved' : 'Save'}
                        </Button>
                    </Flex>
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
};

export default Portfolio;
