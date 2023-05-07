import React from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import '../../styles/global.scss';

function Holding(props) {
    const {
        ticker,
        currency,
        buy_shares: buyShares,
        sell_shares: sellShares,
        avg_price: avgPrice,
        last_price: lastPrice,
    } = props.detail;

    return (
        <Grid className="grid4">
            <GridItem fontWeight="bold">{ticker}</GridItem>
            <GridItem fontWeight="bold" textAlign="right">
                ${lastPrice} {currency.toUpperCase()}
            </GridItem>
            <GridItem>{buyShares - sellShares} shares</GridItem>
            <GridItem textAlign="right">Avg price: ${avgPrice}</GridItem>
        </Grid>
    );
}

export default Holding;
