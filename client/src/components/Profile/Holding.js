import React from 'react';
import { Grid, GridItem, Box, HStack, Stat, StatArrow } from '@chakra-ui/react';
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
                    {price !== 0 && Math.abs(diff) > 0.001 ? (
                        <Stat color={diff > 0 ? 'light.green' : 'light.red'}>
                            {diff > 0 ? (
                                <StatArrow
                                    type="increase"
                                    color="light.green"
                                />
                            ) : (
                                <StatArrow type="decrease" color="light.red" />
                            )}
                            ${Math.abs(diff).toFixed(2)}
                        </Stat>
                    ) : (
                        <Box color="light.grey">$0.00</Box>
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
