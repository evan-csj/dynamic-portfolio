import React, { useEffect, useState } from 'react';
import { Flex, Grid, GridItem } from '@chakra-ui/react';
import { getPortfolio } from '../../global/axios';
import PortfolioItem from './PortfolioItem';
import '../../styles/global.scss';

function Portfolio(props) {
    const [portfolioList, setPortfolioList] = useState([]);
    const [availablePct, setAvailablePct] = useState(0);
    const [totalPct, setTotalPct] = useState(100)
    const updatePct = (ticker, value) => {
        const newPortfolio = [...portfolioList];
        let newAvailablePct = 100;
        let newTotal = 0;
        newPortfolio.map(item => {
            if (item.ticker === ticker) {
                item.percentage = value;
            }
            newAvailablePct -= item.percentage;
            newTotal +=item.percentage
        });
        setPortfolioList(newPortfolio);
        setAvailablePct(newAvailablePct);
        setTotalPct(newTotal)
    };

    useEffect(() => {
        getPortfolio(props.userId).then(response => {
            setPortfolioList(response.data);
        });
    }, []);

    return (
        <Flex className="flex-col">
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
