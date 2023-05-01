// import '@components/styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme/theme';
import localFont from 'next/font/local'

const jost = localFont({
    src: [
      {
        path: '../assets/fonts/Jost-Bold.ttf',
        weight: '700',
        style: 'normal',
      },
      {
        path: '../assets/fonts/Jost-Regular.ttf',
        weight: '400',
        style: 'normal',
      },
      {
        path: '../assets/fonts/Jost-Light.ttf',
        weight: '300',
        style: 'normal',
      },
    ],
  })

export default function App({ Component, pageProps }) {
    return (
        <ChakraProvider theme={theme}>
            <main className={jost.className}>
                <Component {...pageProps} />
            </main>
        </ChakraProvider>
    );
}
