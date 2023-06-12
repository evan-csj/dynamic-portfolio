import React, { useState, useEffect } from 'react';
import {
    Grid,
    GridItem,
    HStack,
    Box,
    Stat,
    StatArrow,
    Skeleton,
    Image,
    SkeletonCircle,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { getCompanyProfile } from '../../global/axios';
import '../../styles/global.scss';

const WatchItem = props => {
    const { ticker, price, currency, prev_close: prevClose } = props.detail;
    const usd2cad = props.usd2cad;
    const diff = price - prevClose;
    const [logo, setLogo] = useState(undefined);

    useEffect(() => {
        getCompanyProfile(ticker).then(response => {
            setLogo(response.data.logo);
        });
    }, [ticker]);

    return (
        <Grid
            className="grid-watch"
            cursor="pointer"
            onClick={() => props.changeTicker(ticker)}
            _hover={{ bg: 'light.yellow' }}
            h={12}
            pl={2}
        >
            <GridItem>
                {logo ? (
                    <Image
                        borderRadius="full"
                        boxSize="30px"
                        src={logo}
                        alt={ticker}
                    />
                ) : (
                    <SkeletonCircle size="30px" />
                )}
            </GridItem>
            <GridItem as="span" fontWeight="bold">
                {ticker}
            </GridItem>
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

                    <Skeleton isLoaded={price !== 0}>
                        $
                        {currency === 'cad'
                            ? (price * usd2cad).toFixed(2)
                            : price.toFixed(2)}
                    </Skeleton>

                    <Box>{currency.toUpperCase()}</Box>
                </HStack>
            </GridItem>
            <GridItem textAlign="right">
                <CloseIcon
                    boxSize={8}
                    p={2}
                    cursor="pointer"
                    borderRadius={4}
                    _hover={{ background: 'light.black', color: 'light.white' }}
                    onClick={event => {
                        props.deleteTicker(ticker);
                        event.stopPropagation();
                    }}
                />
            </GridItem>
        </Grid>
    );
};

export default WatchItem;
