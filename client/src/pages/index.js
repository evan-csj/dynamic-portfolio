import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
// import styles from '@components/styles/Home.module.css'
import { Box } from '@chakra-ui/react';
import { ChartComponent } from './components/Chart';

const inter = Inter({ subsets: ['latin'] });

const initialData = [
    { time: '2018-12-22', value: 32.51 },
    { time: '2018-12-23', value: 31.11 },
    { time: '2018-12-24', value: 27.02 },
    { time: '2018-12-25', value: 27.32 },
    { time: '2018-12-26', value: 25.17 },
    { time: '2018-12-27', value: 28.89 },
    { time: '2018-12-28', value: 25.46 },
    { time: '2018-12-29', value: 23.92 },
    { time: '2018-12-30', value: 22.68 },
    { time: '2018-12-31', value: 22.67 },
];

const candlestickData = [
    { time: '2018-12-22', open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
    { time: '2018-12-23', open: 45.12, high: 53.9, low: 45.12, close: 48.09 },
    { time: '2018-12-24', open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
    { time: '2018-12-25', open: 68.26, high: 68.26, low: 59.04, close: 60.5 },
    { time: '2018-12-26', open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
    { time: '2018-12-27', open: 91.04, high: 121.4, low: 82.7, close: 111.4 },
    { time: '2018-12-28', open: 111.51, high: 142.83, low: 103.34, close: 131.25 },
    { time: '2018-12-29', open: 131.33, high: 151.17, low: 77.68, close: 96.43 },
    { time: '2018-12-30', open: 106.33, high: 110.2, low: 90.39, close: 98.1 },
    { time: '2018-12-31', open: 109.87, high: 114.69, low: 85.66, close: 111.26 },
];

export default function Home() {
    return (
        <>
            <Head>
                <title>Dynamic Portfolio</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Box bg="light.navy" color="light.white" className='futura-light'>
                    Hello World
                </Box>
                <ChartComponent data={candlestickData}></ChartComponent>
                {/* <div className={styles.description}>
          <p>
            Get started by editing&nbsp;
            <code className={styles.code}>src/pages/index.js</code>
          </p>
          <div>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              By{' '}
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                className={styles.vercelLogo}
                width={100}
                height={24}
                priority
              />
            </a>
          </div>
        </div>

        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
        </div>

        <div className={styles.grid}>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Docs <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Find in-depth information about Next.js features and&nbsp;API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Learn <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Learn about Next.js in an interactive course with&nbsp;quizzes!
            </p>
          </a>

          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Templates <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Discover and deploy boilerplate example Next.js&nbsp;projects.
            </p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Deploy <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Instantly deploy your Next.js site to a shareable URL
              with&nbsp;Vercel.
            </p>
          </a>
        </div> */}
            </main>
        </>
    );
}
