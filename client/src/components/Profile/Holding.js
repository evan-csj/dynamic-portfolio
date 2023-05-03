import React from 'react';
import { Flex, Box, Grid, GridItem } from '@chakra-ui/react';

function Holding(props) {
    const ticker = props.detail.ticker;
    const currency = props.detail.currency.toUpperCase();
    const shares = props.detail.buy_shares - props.detail.sell_shares;
    const avgPrice = props.detail.avg_price;
    return (
        <Grid
            borderBottomColor="light.grey"
            borderBottomWidth={1}
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(2, 1fr)"
            p={4}
        >
            <GridItem>{ticker}</GridItem>
            <GridItem textAlign="right">$Price {currency}</GridItem>
            <GridItem>{shares} shares</GridItem>
            <GridItem textAlign="right">Avg price: ${avgPrice}</GridItem>
        </Grid>
    );
}

export default Holding;
