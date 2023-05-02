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
        Heading: {
            baseStyle: {
                fontFamily: 'Jost',
            },
            size: {
                sm: {
                    fontSize: 'sm',
                    fontWeight: '300',
                },
            },
        },
        Flex: {
            variants: {
                col: {
                    flexDirection: 'column',
                },
            },
        },
    },
    shadows: {
        mainTab: '0 0 10px 1px rgba(33, 42, 62, 0.3)',
    },
    styles: {
        global: {
            body: {
                fontFamily: 'Jost',
            },
            '.money': {
                textAlign: 'right',
            },
        },
    },
});

export default theme;
