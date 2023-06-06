import React from 'react';
import { Flex, Box } from '@chakra-ui/react';
import '../styles/global.scss';
import WatchItem from './Watchlist/WatchItem';
import Holding from './Profile/Holding';

function ObjList(props) {
    const list = props.list;
    const usd2cad = props.usd2cad || 1;

    if (props.type !== 'watchlist' && props.type !== 'holding') {
        return <></>;
    }

    if (Object.keys(list).length > 0) {
        return (
            <Flex className="flex-col">
                {Object.keys(list).map((ticker, index) => {
                    if (props.type === 'watchlist') {
                        return (
                            <WatchItem
                                key={index}
                                detail={list[ticker]}
                                usd2cad={usd2cad}
                                changeTicker={props.changeTicker}
                                deleteTicker={props.deleteTicker}
                            />
                        );
                    }

                    if (props.type === 'holding') {
                        if (
                            list[ticker].buy_shares -
                                list[ticker].sell_shares ===
                            0
                        ) {
                            return <Box key={index}></Box>;
                        }
                        return (
                            <Holding
                                key={index}
                                detail={list[ticker]}
                                usd2cad={usd2cad}
                            />
                        );
                    }
                })}
            </Flex>
        );
    } else {
        return <></>;
    }
}

export default ObjList;
