// import '@components/styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme/theme';
import '../theme/fonts.css';

export default function App({ Component, pageProps }) {
    return (
        <ChakraProvider theme={theme}>
            <Component {...pageProps} />
        </ChakraProvider>
    );
}
