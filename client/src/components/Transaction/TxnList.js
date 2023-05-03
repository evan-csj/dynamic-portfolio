import React from 'react';
import { Flex, Box } from '@chakra-ui/react';
import '../../styles/global.scss';
import Trading from './Trading';
import Funding from './Funding';

function TxnList(props) {
    const list = props.list;

    if (props.type !== 'trading' && props.type !== 'funding') {
        return <></>;
    }
    if (list !== []) {
        return (
            <Flex className="flex-col">
                {list.map((item, index) => {
                    if (props.type === 'trading')
                        return <Trading key={index} detail={item} />;
                    if (props.type === 'funding')
                        return <Funding key={index} detail={item} />;
                })}
            </Flex>
        );
    } else {
        return <></>;
    }
}

export default TxnList;
