import {
  json,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react";
import { Settings } from "luxon";
import { cn } from "~/core/classNames";
import { Config, useConfig } from "~/core/config";
import { createConfig } from "~/core/config.server";
import { createSocialMeta } from "~/core/meta";
import { getPageTitle, pageDescription } from "~/core/pageTitle";
import { ErrorPage } from "~/dataDisplay/errorPage";
import stylesheet from "~/generated/tailwind.css";
import { theme } from "~/generated/theme";
import appleTouchIcon from "~/images/appleTouchIcon.png";
import background from "~/images/background.svg";
import favicon from "~/images/favicon.svg";
import maskIcon from "~/images/maskIcon.svg";
import { socialImages } from "~/images/social";
import { Footer } from "~/layout/footer";
import { Header } from "~/layout/header";

Settings.defaultLocale = "fr";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesheet },
    { rel: "manifest", href: "/manifest.json" },
    { rel: "icon", href: favicon },
    {
      rel: "mask-icon",
      href: maskIcon,
      color: theme.colors.brandBlue.DEFAULT,
    },
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
  ];
};

export type LoaderData = {
  config: Config;
};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({ config: createConfig() });
};

export const meta: MetaFunction = ({ data, location }) => {
  // The data can be null in case of error.
  const config = (data as LoaderData | null)?.config;
  const title = getPageTitle();

  let url: string | undefined = undefined;
  let imageUrl: string | undefined = undefined;

  if (config != null) {
    url = config.publicHost;
    if (location.pathname !== "/") {
      url = `${url}${location.pathname}`;
    }

    imageUrl = `${config.publicHost}${socialImages.default.imagesBySize[1024]}`;
  }

  return {
    charset: "utf-8",
    "theme-color": theme.colors.gray[50],

    // Use `maximum-scale=1` to prevent browsers to zoom on form elements.
    viewport:
      "width=device-width, minimum-scale=1, initial-scale=1, maximum-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover",

    ...createSocialMeta({ title, description: pageDescription, imageUrl }),

    // Meta tags that shouldn't be overridden by route meta.
    "og:type": "website",
    "og:site_name": title,
    "og:locale": "fr_FR",
    "og:url": url,
    "twitter:card": "summary_large_image",
    "twitter:url": url,
  };
};

export default function App() {
  const { googleTagManagerId } = useConfig();

  return (
    <Document googleTagManagerId={googleTagManagerId}>
      <Header />
      <Outlet />
      <Footer />
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document>
      <ErrorPage isStandAlone status={caught.status} />
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error("ErrorBoundary error", error);

  return (
    <Document>
      <ErrorPage isStandAlone status={500} />
    </Document>
  );
}

function Document({
  googleTagManagerId,
  children,
}: {
  googleTagManagerId?: string;
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className="bg-gray-50 bg-repeat"
      style={{ backgroundImage: `url("${background}"` }}
    >
      <head>
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
          "px-safe-0 pb-safe-0",
          "antialiased text-gray-800 text-body-default flex flex-col items-center gap-6",
          "md:gap-12"
        )}
      >
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
