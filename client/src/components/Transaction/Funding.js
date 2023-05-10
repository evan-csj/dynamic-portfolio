import React from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import '../../styles/global.scss';

const dayjs = require('dayjs');

function Funding(props) {
    const { amount, type, currency, created_at: timestamp } = props.detail;
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'usd',
    });

    return (
        <Grid className="grid4">
            <GridItem
                fontWeight="bold"
                color={
                    type === 'deposit'
                        ? 'light.green'
                        : type === 'withdraw'
                        ? 'light.red'
                        : 'light.grey'
                }
            >
                {type.charAt(0).toUpperCase() + type.slice(1)}
            </GridItem>
            <GridItem fontWeight="bold" textAlign="right" rowSpan={2} alignSelf="center">
                {formatter.format(amount)} {currency.toUpperCase()}
            </GridItem>
            <GridItem>{dayjs(timestamp).format('MMM DD, YYYY')}</GridItem>
        </Grid>
    );
}

export default Funding;
