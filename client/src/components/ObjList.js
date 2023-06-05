import React from 'react';
import { Flex } from '@chakra-ui/react';
import '../styles/global.scss';
import WatchItem from './Watchlist/WatchItem';

function ObjList(props) {
    const list = props.list;
    const usd2cad = props.usd2cad || 1;

    if (props.type !== 'watchlist') {
        return <></>;
    }

    if (Object.keys(list).length > 0) {
        return (
            <Flex className="flex-col">
                {Object.keys(list).map((ticker, index) => {
                    if (props.type === 'watchlist')
                        return (
                            <WatchItem
                                key={index}
                                detail={list[ticker]}
                                usd2cad={usd2cad}
                                changeTicker={props.changeTicker}
                                deleteTicker={props.deleteTicker}
                            />
                        );
                })}
            </Flex>
        );
    } else {
        return <></>;
    }
}

export default ObjList;
