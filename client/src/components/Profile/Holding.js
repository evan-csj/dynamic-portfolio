import React from 'react';
import { Grid, GridItem, Box, HStack } from '@chakra-ui/react';
import '../../styles/global.scss';

function Holding(props) {
    const {
        ticker,
        currency,
        buy_shares: buyShares,
        sell_shares: sellShares,
        avg_price: avgPrice,
        price: price,
    } = props.detail;

    const diff = price - avgPrice;

    return (
        <Grid className="grid4">
            <GridItem fontWeight="bold">{ticker}</GridItem>
            <GridItem fontWeight="bold" textAlign="right">
                <HStack justify="end">
                    {price !== 0 ? (
                        <Box color={diff >= 0 ? 'light.green' : 'light.red'}>
                            {diff >= 0 ? '+' : '-'}${Math.abs(diff).toFixed(2)}
                        </Box>
                    ) : (
                        <Box></Box>
                    )}

                    <Box>
                        $
                        {currency === 'cad'
                            ? (price * props.usd2cad).toFixed(2)
                            : price.toFixed(2)}{' '}
                        {currency.toUpperCase()}
                    </Box>
                </HStack>
            </GridItem>
            <GridItem>{(buyShares - sellShares).toFixed(2)} shares</GridItem>
            <GridItem textAlign="right">
                Avg price: ${avgPrice.toFixed(2)}
            </GridItem>
        </Grid>
    );
}

export default Holding;
