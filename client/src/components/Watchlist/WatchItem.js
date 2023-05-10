import React from 'react';
import { Grid, GridItem, Text } from '@chakra-ui/react';
import '../../styles/global.scss';

function WatchItem(props) {
    const { ticker, price, currency } = props.detail;

    return (
        <Grid className="grid2">
            <GridItem as="span" fontWeight="bold">
                {ticker}
            </GridItem>
            <GridItem fontWeight="bold" textAlign="right">
                ${price} {currency.toUpperCase()}
            </GridItem>
        </Grid>
    );
}

export default WatchItem;
