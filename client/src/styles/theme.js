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
    styles: {
        global: {
            body: {
                fontFamily: 'Jost',
            },
        },
    },
});

export default theme;
