import { json, LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import { cn } from "~/core/classNames";
import { useConfig } from "~/core/config";
import { createConfig } from "~/core/config.server";
import { ErrorPage } from "~/core/dataDisplay/errorPage";
import { createCloudinaryUrl } from "~/core/dataDisplay/image";
import { PageBackground } from "~/core/layout/pageBackground";
import { getPageTitle, pageDescription } from "~/core/pageTitle";
import { theme } from "~/generated/theme";
import appleTouchIcon from "~/images/appleTouchIcon.png";
import faviconDark from "~/images/faviconDark.png";
import faviconLight from "~/images/faviconLight.png";
import maskIcon from "~/images/maskIcon.png";
import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesheet },
    { rel: "manifest", href: "/manifest.json" },
    { rel: "icon", href: faviconLight, media: "(prefers-color-scheme: light)" },
    { rel: "icon", href: faviconDark, media: "(prefers-color-scheme: dark)" },
    { rel: "mask-icon", href: maskIcon, color: theme.colors.mystic.DEFAULT },
    { rel: "apple-touch-icon", href: appleTouchIcon },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;600&display=swap",
    },
    { rel: "stylesheet", href: "/fonts/caramel-mocacino/font.css" },
    {
      rel: "preload",
      href: "/fonts/caramel-mocacino/caramel-mocacino.otf",
      as: "font",
      crossOrigin: "anonymous",
    },
  ];
};

export async function loader() {
  return json({ config: createConfig() });
}

export default function App() {
  const { cloudinaryName, googleTagManagerId, publicHost } = useConfig();

  return (
    <Document
      cloudinaryName={cloudinaryName}
      googleTagManagerId={googleTagManagerId}
      publicHost={publicHost}
    >
      <Outlet />
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
  cloudinaryName,
  googleTagManagerId,
  publicHost,
}: {
  children: React.ReactNode;
  cloudinaryName?: string;
  googleTagManagerId?: string;
  publicHost?: string;
}) {
  const location = useLocation();

  let url = publicHost;
  if (url != null && location.pathname !== "/") {
    url = `${url}${location.pathname}`;
  }

  let imageUrl: string | undefined = undefined;
  if (cloudinaryName != null) {
    imageUrl = createCloudinaryUrl(
      cloudinaryName,
      "show/f4fe85de-763b-41f8-8f3e-5dc6db343804",
      { size: "1024", format: "jpg" }
    );
  }

  return (
    <html lang="fr" className="bg-white bg-var-white">
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
          "min-h-screen antialiased grid grid-cols-1 text-prussianBlue text-body-lowercase-default",
          // Make sure children with absolute positionning are correctly placed.
          "relative"
        )}
      >
        <PageBackground />

        {googleTagManagerId != null && (
          <GoogleTagManagerIframe id={googleTagManagerId} />
        )}

        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
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
