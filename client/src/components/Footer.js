import React, { Profiler } from 'react';
import { Flex } from '@chakra-ui/react';
import { Profile, CandleStick, History, Login } from '../styles/icons';

function Footer() {
    return (
        <Flex justifyContent="space-between">
            <Profile variant="btn" />
            <CandleStick variant="btn" />
            <History variant="btn" />
            <Login variant="btn" />
        </Flex>
    );
}

export default Footer;
