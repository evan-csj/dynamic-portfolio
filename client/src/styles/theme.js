import { extendTheme } from '@chakra-ui/react';
import './global.scss';

const theme = extendTheme({
    colors: {
        light: {
            navy: '#10316B',
            blue: '#0B409C',
            yellow: '#FFCE63',
            white: '#FFFFFF',
            black: '#212A3E',
            grey: '#9BA4B5',
            green: '#0B8457',
            red: '#FF5F5F',
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
        Button: {
            variants: {
                submit: {
                    color: 'light.white',
                    background: 'light.black',
                    borderRadius: 20,
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
                color: 'light.black',
                fontFamily: 'Jost',
            },
            '.money': {
                textAlign: 'right',
            },
        },
    },
});

export default theme;
