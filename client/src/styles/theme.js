import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    colors: {
        light: {
            navy: '#10316B',
            blue: '#0B409C',
            yellow: '#FFCE63',
            white: '#F2F7FF',
        },
    },
    fonts: {
        heading: `'Jost Bold', sans-serif`,
        body: `'Jost Regular', sans-serif`,
    },
    components: {
        Icon: {
            variants: {
                btn: {
                    w: '12',
                    h: '12',
                },
            },
        },
    },
});

export default theme;
