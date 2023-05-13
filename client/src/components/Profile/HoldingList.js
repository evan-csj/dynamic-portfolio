import React from 'react';
import Holding from './Holding';
import { Flex, Box } from '@chakra-ui/react';
import '../../styles/global.scss';

function HoldingList(props) {
    if (props.list !== []) {
        return (
            <Flex className="flex-col">
                {props.list.map((item, index) => {
                    if(item.buy_shares - item.sell_shares === 0) {
                        return <Box key={index}></Box>
                    }
                    return <Holding key={index} detail={item} usd2cad={props.usd2cad}/>;
                })}
            </Flex>
        );
    } else {
        return <></>;
    }
}

export default HoldingList;
