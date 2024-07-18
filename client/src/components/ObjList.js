import React from 'react';
import { Flex, Box } from '@chakra-ui/react';
import '../styles/global.scss';
import WatchItem from './Watchlist/WatchItem';
import Holding from './Profile/Holding';

const ObjList = props => {
    const list = props.list;
    const usd2cad = props.usd2cad || 1;

    if (props.type !== 'watchlist' && props.type !== 'holding') {
        return <></>;
    }

    if (Object.keys(list).length > 0) {
        return (
            <Flex className="flex-col">
                {Object.keys(list).map((ticker, index) => {
                    const item = list[ticker];
                    switch (props.type) {
                        case 'watchlist':
                            return (
                                <WatchItem
                                    key={index}
                                    detail={item}
                                    usd2cad={usd2cad}
                                    changeTicker={props.changeTicker}
                                    deleteTicker={props.deleteTicker}
                                />
                            );
                        case 'holding':
                            if (item.buy_shares - item.sell_shares === 0) {
                                return <Box key={index}></Box>;
                            }
                            return (
                                <Holding
                                    key={index}
                                    detail={item}
                                    usd2cad={usd2cad}
                                />
                            );
                        default:
                            return <></>;
                    }
                })}
            </Flex>
        );
    } else {
        return <></>;
    }
};

export default ObjList;
