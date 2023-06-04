import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>都道府県人口グラフ</title>
        <link rel="icon" href="/japan.jpeg" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
