import Head from "next/head";

export function PageHead() {
  return (
    <Head>
      <title>Ani'Meaux</title>
      <meta charSet="utf-8" />

      <meta name="application-name" content="Ani'Meaux" />

      <meta
        name="description"
        content="Site internet de l'association Ani'Meaux"
      />

      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />

      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />

      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href="/favicon-96x96.png"
      />

      <meta
        name="viewport"
        // Use `maximum-scale=1` to prevent browsers to zoom on form elements.
        content="width=device-width, minimum-scale=1, initial-scale=1, maximum-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />

      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Playfair+Display:300,400,400i,500,600,700&display=swap"
      />

      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,400i,500,600,700&display=swap"
      />
    </Head>
  );
}
