import React from 'react';
import { Grid, GridItem, HStack, Box } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import '../../styles/global.scss';

function WatchItem(props) {
    const { ticker, price, currency, prev_close: prevClose } = props.detail;
    const usd2cad = props.usd2cad;
    const diff = price - prevClose;

    return (
        <Grid
            className="grid2"
            cursor="pointer"
            onClick={() => props.changeTicker(ticker)}
            _hover={{ bg: 'light.yellow' }}
        >
            <GridItem as="span" fontWeight="bold">
                {ticker}
            </GridItem>
            <GridItem fontWeight="bold" textAlign="right">
                <HStack justify="end">
                    {price !== 0 && Math.abs(diff) > 0.001 ? (
                        <Box color={diff > 0 ? 'light.green' : 'light.red'}>
                            {diff > 0 ? '+' : '-'}${Math.abs(diff).toFixed(2)}
                        </Box>
                    ) : (
                        <Box></Box>
                    )}

                    <Box>
                        $
                        {currency === 'cad'
                            ? (price * usd2cad).toFixed(2)
                            : price.toFixed(2)}{' '}
                        {currency.toUpperCase()}
                    </Box>
                </HStack>
            </GridItem>
            <GridItem textAlign="right">
                <CloseIcon
                    cursor="pointer"
                    onClick={event => {
                        props.deleteTicker(ticker);
                        event.stopPropagation();
                    }}
                />
            </GridItem>
        </Grid>
    );
}

export default WatchItem;
