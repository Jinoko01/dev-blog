import { Html, Head, Main, NextScript } from "next/document"

export default function Document({ assetPrefix, ...etc }: any) {
  return (
    <Html>
      <Head>
        <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`} crossOrigin="anonymous"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}