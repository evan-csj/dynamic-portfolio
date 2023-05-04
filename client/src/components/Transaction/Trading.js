import React from 'react';
import { Grid, GridItem, Text } from '@chakra-ui/react';
import '../../styles/global.scss';

const dayjs = require('dayjs');

function Trading(props) {
    const {
        ticker,
        price,
        shares,
        type,
        order_status: orderStatus,
        currency,
        created_at: timestamp,
    } = props.detail;

    return (
        <Grid className="grid4">
            <GridItem>
                <Text as="span" fontWeight="bold">
                    {ticker}
                </Text>
                {' \u2022 '}
                <Text
                    as="span"
                    color={
                        orderStatus === 'approved'
                            ? 'light.green'
                            : orderStatus === 'pending'
                            ? 'light.yellow'
                            : orderStatus === 'declined'
                            ? 'light.red'
                            : 'light.grey'
                    }
                >
                    {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
                </Text>
            </GridItem>
            <GridItem fontWeight="bold" textAlign="right">
                ${price} {currency.toUpperCase()}
            </GridItem>
            <GridItem>{dayjs(timestamp).format('MMM DD, YYYY')}</GridItem>
            <GridItem textAlign="right">
                <Text
                    as="span"
                    color={
                        type === 'buy'
                            ? 'light.green'
                            : type === 'sell'
                            ? 'light.red'
                            : 'light.grey'
                    }
                >
                    {type.charAt(0).toUpperCase() + type.slice(1)}{' '}
                </Text>
                {shares} shares
            </GridItem>
        </Grid>
    );
}

export default Trading;
