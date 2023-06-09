import React from 'react';
import { Grid, GridItem, Text, Badge, Flex } from '@chakra-ui/react';
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
                <Flex alignItems="center" gap={2}>
                    <Text as="span" fontWeight="bold">
                        {ticker}
                    </Text>
                    <Badge
                        color={
                            orderStatus === 'approved'
                                ? 'light.green'
                                : orderStatus === 'pending'
                                ? 'light.white'
                                : orderStatus === 'declined'
                                ? 'light.red'
                                : 'light.grey'
                        }
                        background={
                            orderStatus === 'approved'
                                ? 'lightBG.green'
                                : orderStatus === 'pending'
                                ? 'light.yellow'
                                : orderStatus === 'declined'
                                ? 'lightBG.red'
                                : ''
                        }
                    >
                        {orderStatus.toUpperCase()}
                    </Badge>
                </Flex>
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
                {shares.toFixed(3)} shares
            </GridItem>
        </Grid>
    );
}

export default Trading;
