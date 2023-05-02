import React, { useEffect, useState } from 'react';
import { getHoldings } from '../global/axios';
import Holding from './Holding';
import { Flex, Box } from '@chakra-ui/react';
import '../styles/global.scss';

function HoldingList(props) {
    const [holdingList, setHoldingList] = useState([]);

    useEffect(() => {
        getHoldings(props.userId).then(response => {
            setHoldingList(response.data);
        });
    }, [props.userId]);

    if (holdingList !== []) {
        return (
            <Flex className="flex-col">
                {holdingList.map((item, index) => {
                    return <Holding key={index} detail={item} />;
                })}
            </Flex>
        );
    } else {
        return <></>;
    }
}

export default HoldingList;
