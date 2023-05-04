import React, { useRef, useState, forwardRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Flex,
    Box,
    Button,
    ButtonGroup,
    FormControl,
    FormLabel,
    Input,
    RadioGroup,
    Radio,
    Stack,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverAnchor,
    useDisclosure,
    FocusLock,
} from '@chakra-ui/react';
import { Profile, CandleStick, History, Login, Fund } from '../styles/icons';

const AmountInput = forwardRef((props, ref) => {
    return (
        <FormControl>
            <FormLabel htmlFor={props.id}>{props.label}</FormLabel>
            <Input ref={ref} id={props.id} {...props} />
        </FormControl>
    );
});

const Form = ({ amountRef, currency, currencyChange, onFunding }) => {
    return (
        <Stack spacing={4}>
            <AmountInput
                label="Amount"
                id="amount"
                ref={amountRef}
                defaultValue="0"
            />

            <RadioGroup onChange={currencyChange} value={currency}>
                <Stack spacing={5} direction="row">
                    <Radio value="cad">CAD</Radio>
                    <Radio value="usd">USD</Radio>
                </Stack>
            </RadioGroup>

            <ButtonGroup display="flex" justifyContent="space-between">
                <Button color="light.red" onClick={() => onFunding('withdraw')}>
                    Withdraw
                </Button>
                <Button
                    color="light.green"
                    onClick={() => onFunding('deposit')}
                >
                    Deposit
                </Button>
            </ButtonGroup>
        </Stack>
    );
};

function MainTab() {
    const { onOpen, onClose, isOpen } = useDisclosure();
    const amountRef = useRef(null);
    const [currency, setCurrency] = useState('');
    const sendFunding = type => {
        console.log(amountRef.current.value);
        console.log(currency);
        console.log(type);
    };

    return (
        <>
            <Flex
                bg="light.white"
                shadow="mainTab"
                w="100%"
                px={4}
                py={2}
                borderTopRadius={20}
                pos="fixed"
                bottom={0}
                justifyContent="space-between"
                display={{ base: 'flex', md: 'none' }}
            >
                <NavLink to="/profile">
                    <Profile variant="btn" />
                </NavLink>
                <NavLink to="/candlestick">
                    <CandleStick variant="btn" />
                </NavLink>

                <Popover
                    isOpen={isOpen}
                    initialFocusRef={amountRef}
                    onOpen={onOpen}
                    onClose={onClose}
                    placement="top"
                    closeOnBlur={true}
                >
                    <PopoverTrigger>
                        <Fund variant="btn" />
                    </PopoverTrigger>
                    <PopoverContent p={4} mb={2}>
                        <FocusLock returnFocus persistentFocus={false}>
                            <PopoverArrow />
                            <Form
                                amountRef={amountRef}
                                currency={currency}
                                currencyChange={setCurrency}
                                onFunding={sendFunding}
                            />
                        </FocusLock>
                    </PopoverContent>
                </Popover>

                <NavLink to="/history">
                    <History variant="btn" />
                </NavLink>
                <Login variant="btn" />
            </Flex>
        </>
    );
}

export default MainTab;
