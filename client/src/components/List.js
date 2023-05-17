import React from 'react';
import { Flex } from '@chakra-ui/react';
import '../styles/global.scss';
import Trading from './Transaction/Trading';
import Funding from './Transaction/Funding';
import WatchItem from './Watchlist/WatchItem';

function List(props) {
    const list = props.list;
    const usd2cad = props.usd2cad || 1;

    if (props.type !== 'trading' && props.type !== 'funding' && props.type !== 'watchlist') {
        return <></>;
    }

    if (list.length > 0) {
        return (
            <Flex className="flex-col">
                {list.map((item, index) => {
                    if (props.type === 'trading') return <Trading key={index} detail={item} />;
                    if (props.type === 'funding') return <Funding key={index} detail={item} />;
                    if (props.type === 'watchlist')
                        return (
                            <WatchItem
                                key={index}
                                detail={item}
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

export default List;
