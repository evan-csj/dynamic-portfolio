import React, { useEffect, useState, useRef } from 'react';
import Select from 'react-select';
import { Box, Flex, Center, Grid, GridItem, FormControl, FormHelperText } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { getPortfolio, getSymbols } from '../../global/axios';
import PortfolioItem from './PortfolioItem';
import '../../styles/global.scss';

function Portfolio(props) {
    const [portfolioList, setPortfolioList] = useState([]);
    const [availablePct, setAvailablePct] = useState(0);
    const [searchTicker, setSearchTicker] = useState('');
    const [totalPct, setTotalPct] = useState(100);
    const [existing, setExising] = useState(false);
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

    const addTicker = () => {
        if (searchTicker !== '' && !existing) {
            const newPortfolio = {
                ticker: searchTicker,
                percentage: 1,
            };
            const newPortfolioList = [...portfolioList, newPortfolio];
            setPortfolioList(newPortfolioList);
            setSearchTicker('')
        }
    };

    useEffect(() => {
        getPortfolio(props.userId).then(response => {
            setPortfolioList(response.data);
        });
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
                    <Box flex="1" zIndex={2}>
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
                        max={availablePct + item.percentage}
                    />
                );
            })}
        </Flex>
    );
}

export default Portfolio;
