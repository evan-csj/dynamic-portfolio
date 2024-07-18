import React from 'react';
import { Flex } from '@chakra-ui/react';
import '../styles/global.scss';
import Trading from './Transaction/Trading';
import Funding from './Transaction/Funding';

const List = props => {
    const list = props.list;

    if (
        props.type !== 'trading' &&
        props.type !== 'funding' &&
        props.type !== 'watchlist'
    ) {
        return <></>;
    }

    if (list.length > 0) {
        return (
            <Flex direction="column">
                {list.map((item, index) => {
                    switch (props.type) {
                        case 'trading':
                            return <Trading key={index} detail={item} />;
                        case 'funding':
                            return <Funding key={index} detail={item} />;
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

export default List;
