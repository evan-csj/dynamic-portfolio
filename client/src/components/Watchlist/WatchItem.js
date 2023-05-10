import React from 'react';
import { Grid, GridItem, Text } from '@chakra-ui/react';
import '../../styles/global.scss';

function WatchItem(props) {
    const { ticker, price, currency } = props.detail;
    const usd2cad = props.usd2cad;

    return (
        <Grid className="grid2" cursor="pointer" onClick={() => props.changeTicker(ticker)}>
            <GridItem as="span" fontWeight="bold">
                {ticker}
            </GridItem>
            <GridItem fontWeight="bold" textAlign="right">
                ${currency === 'cad' ? (price * usd2cad).toFixed(2) : price.toFixed(2)}{' '}
                {currency.toUpperCase()}
            </GridItem>
        </Grid>
    );
}

export default WatchItem;
