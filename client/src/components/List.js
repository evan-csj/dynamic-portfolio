import React from 'react';
import { Flex } from '@chakra-ui/react';
import '../styles/global.scss';
import Trading from './Transaction/Trading';
import Funding from './Transaction/Funding';

function List(props) {
    const list = props.list;

    if (props.type !== 'trading' && props.type !== 'funding') {
        return <></>;
    }

    if (list.length > 0) {
        return (
            <Flex className="flex-col">
                {list.map((item, index) => {
                    if (props.type === 'trading') return <Trading key={index} detail={item} />;
                    if (props.type === 'funding') return <Funding key={index} detail={item} />;
                })}
            </Flex>
        );
    } else {
        return <></>;
    }
}

export default List;
