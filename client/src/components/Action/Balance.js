import React from 'react';
import {
    Heading,
    StatGroup,
    StatLabel,
    Stat,
    StatNumber,
} from '@chakra-ui/react';

const Balance = props => {
    return (
        <>
            <Heading>Your Balance</Heading>
            <StatGroup>
                <Stat>
                    <StatLabel>USD Account</StatLabel>
                    <StatNumber>
                        $
                        {props.userData
                            ? props.userData.cash_usd.toFixed(2)
                            : 0}
                    </StatNumber>
                </Stat>

                <Stat>
                    <StatLabel>CAD Account</StatLabel>
                    <StatNumber>
                        $
                        {props.userData
                            ? props.userData.cash_cad.toFixed(2)
                            : 0}
                    </StatNumber>
                </Stat>
            </StatGroup>
        </>
    );
};

export default Balance;
