import React from 'react';
import { Flex, Skeleton } from '@chakra-ui/react';

const SkeletonDollar = props => {
    return (
        <Flex justifyContent="flex-end">
            {props.condition ? (
                '$' + props.value.toFixed(2)
            ) : (
                <Skeleton w="65%" borderRadius="12px">
                    0
                </Skeleton>
            )}
        </Flex>
    );
};

export default SkeletonDollar;
