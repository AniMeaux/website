import {
  json,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  HtmlMetaDescriptor,
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
import { Config } from "~/core/config";
import { createConfig } from "~/core/config.server";
import { getPageTitle } from "~/core/pageTitle";
import { ErrorPage } from "~/dataDisplay/errorPage";
import stylesheet from "~/generated/tailwind.css";
import { theme } from "~/generated/theme";
import appleTouchIcon from "~/images/appleTouchIcon.png";
import background from "~/images/background.svg";
import favicon from "~/images/favicon.svg";
import googleTouchIcon from "~/images/googleTouchIcon.png";
import maskIcon from "~/images/maskIcon.svg";
import { Footer } from "~/layout/footer";
import { Header } from "~/layout/header";

Settings.defaultLocale = "fr";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesheet },
    { rel: "manifest", href: "/manifest.json" },
    { rel: "icon", href: favicon },
    { rel: "mask-icon", href: maskIcon, color: theme.colors.blue.base },
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
  const config = (data as LoaderData).config;
  const title = getPageTitle();

  let metaDescriptor: HtmlMetaDescriptor = {
    charset: "utf-8",
    title,
    description:
      "Trouvez le compagnon de vos rêves et donnez-lui une seconde chance",
    "theme-color": theme.colors.gray[50],

    // Use `maximum-scale=1` to prevent browsers to zoom on form elements.
    viewport:
      "width=device-width, minimum-scale=1, initial-scale=1, maximum-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover",
  };

  if (config != null) {
    let ogUrl = config.publicHost;
    if (location.pathname !== "/") {
      ogUrl = `${ogUrl}${location.pathname}`;
    }

    metaDescriptor = {
      ...metaDescriptor,

      // Default Open Graph tags.
      // See: https://ogp.me/
      "og:site_name": title,
      "og:locale": "fr_FR",
      "og:title": title,
      "og:type": "website",
      "og:image:url": `${config.publicHost}${googleTouchIcon}`,
      "og:image:width": "512",
      "og:image:height": "512",
      "og:image:type": "image/png",
      "og:image:alt": "Ani'Meaux logo",
      "og:url": ogUrl,
    };
  }

  return metaDescriptor;
};

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document>
      <ErrorPage status={caught.status} />
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error("ErrorBoundary error", error);

  return (
    <Document>
      <ErrorPage status={500} />
    </Document>
  );
}

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className="bg-gray-50 bg-repeat"
      style={{ backgroundImage: `url("${background}"` }}
    >
      <head>
        <Meta />
        <Links />
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
        <Header />
        {children}
        <Footer />

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
