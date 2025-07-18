import { useConfig } from "#core/config";
import { createConfig } from "#core/config.server";
import { ErrorPage } from "#core/data-display/error-page";
import { Footer } from "#core/layout/footer";
import { Header } from "#core/layout/header";
import { createSocialMeta } from "#core/meta";
import { getPageTitle, pageDescription } from "#core/page-title";
import { theme } from "#generated/theme";
import appleTouchIcon from "#images/apple-touch-icon.png";
import favicon from "#images/favicon.svg";
import { socialImages } from "#images/social";
import { cn } from "@animeaux/core";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import { Settings } from "luxon";

import "#tailwind.css";

// Display dates in French.
Settings.defaultLocale = "fr";

// All "day dates" should be inferred as in Paris time zone.
// Ex: 2022-01-01 => 2021-12-31T23:00:00.000Z and not 2021-01-01T00:00:00.000Z
Settings.defaultZone = "Europe/Paris";

// We're not supposed to have invalid date objects.
// Use null or undefined instead.
Settings.throwOnInvalid = true;
declare module "luxon" {
  interface TSSettings {
    throwOnInvalid: true;
  }
}

export const links: LinksFunction = () => {
  return [
    { rel: "manifest", href: "/manifest.json" },
    { rel: "icon", href: favicon },
    { rel: "apple-touch-icon", href: appleTouchIcon },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;600&display=swap",
    },
  ];
};

export async function loader() {
  return json({ config: createConfig() });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  // The data can be null in case of error.
  const config = data?.config;

  let imageUrl: string | undefined = undefined;
  if (config != null) {
    imageUrl = `${config.publicHost}${socialImages.default.imagesBySize[1024]}`;
  }

  return createSocialMeta({
    title: getPageTitle(),
    description: pageDescription,
    imageUrl,
  });
};

export default function App() {
  const { googleTagManagerId, publicHost } = useConfig();

  return (
    <Document googleTagManagerId={googleTagManagerId} publicHost={publicHost}>
      <Header />
      <Outlet />
      <Footer />
    </Document>
  );
}

export function ErrorBoundary() {
  return (
    <Document>
      <ErrorPage isStandAlone />
    </Document>
  );
}

function Document({
  children,
  googleTagManagerId,
  publicHost,
}: {
  children: React.ReactNode;
  googleTagManagerId?: string;
  publicHost?: string;
}) {
  const location = useLocation();

  let url = publicHost;
  if (url != null && location.pathname !== "/") {
    url = `${url}${location.pathname}`;
  }

  return (
    <html lang="fr" className="bg-gray-50">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content={theme.colors.gray[50]} />

        {/* Use `maximum-scale=1` to prevent browsers to zoom on form elements. */}
        <meta
          name="viewport"
          content="width=device-width, minimum-scale=1, initial-scale=1, maximum-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />

        <meta property="og:site_name" content={getPageTitle()} />
        <meta property="og:locale" content="fr_FR" />
        <meta name="twitter:card" content="summary_large_image" />

        {url != null ? (
          <>
            <meta property="og:url" content={url} />
            <meta name="twitter:url" content={url} />
          </>
        ) : null}

        <Meta />
        <Links />
        {googleTagManagerId != null && (
          <GoogleTagManagerScript id={googleTagManagerId} />
        )}
      </head>

      <body
        className={cn(
          // Make sure children with absolute positionning are correctly placed.
          "relative",
          "min-h-screen",
          // Safe top padding is handled by the header.
          "pb-safe-0 px-safe-0",
          "flex flex-col items-center gap-6 text-gray-800 text-body-default",
          "md:gap-12",
        )}
      >
        {googleTagManagerId != null && (
          <GoogleTagManagerIframe id={googleTagManagerId} />
        )}

        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function GoogleTagManagerScript({ id }: { id: string }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`,
      }}
    />
  );
}

function GoogleTagManagerIframe({ id }: { id: string }) {
  return (
    <noscript>
      <iframe
        title="Google Tag Manager"
        src={`https://www.googletagmanager.com/ns.html?id=${id}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
