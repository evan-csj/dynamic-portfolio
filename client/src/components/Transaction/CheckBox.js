import { Flex, Box, Text, useCheckbox, chakra } from '@chakra-ui/react';

const CustomCheckbox = props => {
    const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } =
        useCheckbox(props);

    return (
        <chakra.label
            display="flex"
            flexDirection="row"
            alignItems="center"
            gridColumnGap={2}
            maxW="40"
            px={3}
            py={1}
            cursor="pointer"
            // {...htmlProps}
        >
            <input {...getInputProps()} hidden />
            <Flex
                alignItems="center"
                justifyContent="center"
                border="2px solid"
                borderColor="green.500"
                w={4}
                h={4}
                {...getCheckboxProps()}
            >
                {state.isChecked && <Box w={2} h={2} bg="green.500" />}
            </Flex>
            <Text color="gray.700" {...getLabelProps()}>
                Click me for {props.value}
            </Text>
        </chakra.label>
    );
};

export default CustomCheckbox;
