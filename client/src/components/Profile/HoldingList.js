import React from 'react';
import Holding from './Holding';
import { Flex } from '@chakra-ui/react';
import '../../styles/global.scss';

function HoldingList(props) {
    if (props.list !== []) {
        return (
            <Flex className="flex-col">
                {props.list.map((item, index) => {
                    return <Holding key={index} detail={item} usd2cad={props.usd2cad}/>;
                })}
            </Flex>
        );
    } else {
        return <></>;
    }
}

export default HoldingList;
