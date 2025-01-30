/* import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/formique-css@1.0.6/formique.min.css"
          formique-style
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

*/





import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/formique-css@1.0.6/formique.min.css"
          formique-style
        />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;


