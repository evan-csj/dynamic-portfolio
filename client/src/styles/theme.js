import { extendTheme } from '@chakra-ui/react';
import { sliderTheme } from './slider';
import { tabsTheme } from './tabs';
import './global.scss';

const theme = extendTheme({
    breakpoints: {
        sm: '320px',
        md: '480px',
        lg: '768px',
        xl: '1280px',
    },
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
            silver: '#F1F6F9',
        },
        lightBG: {
            green: '#E5F9DB',
            red: '#FFF2F2',
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
        },
        Button: {
            variants: {
                submit: {
                    color: 'light.white',
                    background: 'light.black',
                    borderRadius: 20,
                },
                distribute: {
                    color: 'light.white',
                    background: 'light.black',
                },
            },
        },
        Tabs: tabsTheme,
        Slider: sliderTheme,
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
