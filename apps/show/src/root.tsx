import { ErrorPage } from "#core/data-display/error-page";
import { createImageUrl } from "#core/data-display/image";
import { asRouteHandle } from "#core/handles";
import { getPageTitle, pageDescription } from "#core/page-title";
import { ScrollRestorationLocationState } from "#core/scroll-restoration";
import { theme } from "#generated/theme";
import appleTouchIcon from "#images/apple-touch-icon.png";
import faviconDark from "#images/favicon-dark.png";
import faviconLight from "#images/favicon-light.png";
import maskIcon from "#images/mask-icon.png";
import { cn } from "@animeaux/core";
import type { LinkDescriptor, LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useMatches,
} from "@remix-run/react";
import { withSentry } from "@sentry/remix";
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
    { rel: "icon", href: faviconLight, media: "(prefers-color-scheme: light)" },
    { rel: "icon", href: faviconDark, media: "(prefers-color-scheme: dark)" },
    { rel: "mask-icon", href: maskIcon, color: theme.colors.mystic.DEFAULT },
    { rel: "apple-touch-icon", href: appleTouchIcon },

    { rel: "stylesheet", href: theme.fonts.serif.cssUrl },
    ...theme.fonts.serif.variants.map<LinkDescriptor>((variant) => ({
      rel: "preload",
      href: variant.url,
      as: "font",
      crossOrigin: "anonymous",
    })),

    { rel: "stylesheet", href: theme.fonts.sans.cssUrl },
    ...theme.fonts.sans.variants.map<LinkDescriptor>((variant) => ({
      rel: "preload",
      href: variant.url,
      as: "font",
      crossOrigin: "anonymous",
    })),
  ];
};

export async function loader() {
  return json({ CLIENT_ENV: global.CLIENT_ENV });
}

export function ErrorBoundary() {
  return (
    <Document isErrorPage>
      <ErrorPage isRoot />

      <GlobalClientEnv />
    </Document>
  );
}

export default withSentry(App);

function App() {
  const { CLIENT_ENV } = useLoaderData<typeof loader>();

  return (
    <Document
      cloudinaryName={CLIENT_ENV.CLOUDINARY_CLOUD_NAME}
      googleTagManagerId={CLIENT_ENV.GOOGLE_TAG_MANAGER_ID}
      publicHost={CLIENT_ENV.PUBLIC_HOST}
    >
      <Outlet />

      <GlobalClientEnv clientEnv={CLIENT_ENV} />
    </Document>
  );
}

function Document({
  isErrorPage = false,
  cloudinaryName,
  googleTagManagerId,
  publicHost,
  children,
}: {
  isErrorPage?: boolean;
  cloudinaryName?: string;
  googleTagManagerId?: string;
  publicHost?: string;
  children: React.ReactNode;
}) {
  const location = useLocation();

  let url = publicHost;
  if (url != null && location.pathname !== "/") {
    url = `${url}${location.pathname}`;
  }

  let imageUrl: string | undefined = undefined;
  if (cloudinaryName != null) {
    imageUrl = createImageUrl(
      cloudinaryName,
      "show/f4fe85de-763b-41f8-8f3e-5dc6db343804",
      { size: "1024", format: "jpg" },
    );
  }

  const routeHandles = useMatches().map((match) => asRouteHandle(match.handle));
  const htmlBackgroundColor = routeHandles
    .map((handle) => handle.htmlBackgroundColor)
    .find((color) => color != null);

  const isFullHeight = routeHandles.some((handle) => handle.isFullHeight);

  return (
    <html
      lang="fr"
      className={cn(
        isErrorPage || htmlBackgroundColor == null
          ? "bg-white"
          : htmlBackgroundColor,
        isFullHeight ? "h-full" : undefined,
      )}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content={theme.colors.white} />

        {/* Use `maximum-scale=1` to prevent browsers to zoom on form elements. */}
        <meta
          name="viewport"
          content="width=device-width, minimum-scale=1, initial-scale=1, maximum-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={getPageTitle()} />
        <meta property="og:locale" content="fr_FR" />
        <meta name="twitter:card" content="summary_large_image" />

        <meta name="description" content={pageDescription} />
        <meta property="og:description" content={pageDescription} />
        <meta property="twitter:description" content={pageDescription} />

        {url != null ? (
          <>
            <meta property="og:url" content={url} />
            <meta name="twitter:url" content={url} />
          </>
        ) : null}

        {imageUrl != null ? (
          <>
            <meta property="og:image" content={imageUrl} />
            <meta property="twitter:image" content={imageUrl} />
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
          "grid grid-cols-1 text-prussianBlue text-body-lowercase-default",
          isFullHeight ? "h-full" : "min-h-screen content-start",

          // We never want horizontal scroll at the page level.
          "overflow-x-clip",

          // Make sure children with absolute positionning are correctly placed.
          "relative",

          // Make line breaks are added mid-word if needed.
          // See https://tailwindcss.com/docs/word-break#break-words
          "break-words",
        )}
      >
        {googleTagManagerId != null && (
          <GoogleTagManagerIframe id={googleTagManagerId} />
        )}

        {children}

        <ScrollRestoration
          getKey={(location) => {
            const { scrollRestorationLocationKey } =
              ScrollRestorationLocationState.parse(location.state);

            return scrollRestorationLocationKey ?? location.key;
          }}
        />

        <Scripts />
      </body>
    </html>
  );
}

function GlobalClientEnv({
  clientEnv = {},
}: {
  clientEnv?: Record<string, any>;
}) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.CLIENT_ENV = ${JSON.stringify(clientEnv)};`,
      }}
    />
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
