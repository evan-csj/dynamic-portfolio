import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Flex,
    Box,
    Button,
    ButtonGroup,
    FormControl,
    FormLabel,
    Input,
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
import { color } from 'framer-motion';

const TextInput = React.forwardRef((props, ref) => {
    return (
        <FormControl>
            <FormLabel htmlFor={props.id}>{props.label}</FormLabel>
            <Input ref={ref} id={props.id} {...props} />
        </FormControl>
    );
});

const Form = ({ amountRef }) => {
    return (
        <Stack spacing={8}>
            <TextInput
                label="Amount"
                id="amount"
                ref={amountRef}
                defaultValue="0"
            />
            <ButtonGroup display="flex" justifyContent="space-between">
                <Button color="light.red">Withdraw</Button>
                <Button color="light.green">Deposit</Button>
            </ButtonGroup>
        </Stack>
    );
};

function MainTab() {
    const { onOpen, onClose, isOpen } = useDisclosure();
    const amountRef = React.useRef(null);

    return (
        <>
            <Box h={20}></Box>
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
                    closeOnBlur={false}
                >
                    <PopoverTrigger>
                        <Fund variant="btn" />
                    </PopoverTrigger>
                    <PopoverContent p={4} mb={2}>
                        <FocusLock returnFocus persistentFocus={false}>
                            <PopoverArrow />
                            <Form amountRef={amountRef} />
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
