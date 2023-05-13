import {
  json,
  LinksFunction,
  MetaFunction,
  SerializeFrom,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
} from "@remix-run/react";
import { Settings } from "luxon";
import { cn } from "~/core/classNames";
import { createConfig } from "~/core/config.server";
import { ErrorPage } from "~/core/dataDisplay/errorPage";
import { asRouteHandle } from "~/core/handles";
import { getPageTitle } from "~/core/pageTitle";
import stylesheet from "~/generated/tailwind.css";
import { theme } from "~/generated/theme";
import appleTouchIcon from "~/images/appleTouchIcon.png";
import favicon from "~/images/favicon.svg";
import maskIcon from "~/images/maskIcon.svg";

// Display dates in French.
Settings.defaultLocale = "fr";

// All "day dates" should be inferred as in Paris time zone.
// Ex: 2022-01-01 => 2021-12-31T23:00:00.000Z and not 2021-01-01T00:00:00.000Z
Settings.defaultZone = "Europe/Paris";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesheet },
    { rel: "manifest", href: "/manifest.json" },
    { rel: "icon", href: favicon },
    {
      rel: "mask-icon",
      href: maskIcon,
      color: theme.colors.blue[500],
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

export async function loader() {
  return json({ config: createConfig() });
}

export type LoaderData = SerializeFrom<typeof loader>;

export const meta: MetaFunction = () => {
  return {
    charset: "utf-8",
    "theme-color": theme.colors.white,

    // Use `maximum-scale=1` to prevent browsers to zoom on form elements.
    viewport:
      "width=device-width, minimum-scale=1, initial-scale=1, maximum-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover",

    title: getPageTitle(),

    // We don't want it to be index by search engines.
    // See https://developers.google.com/search/docs/advanced/crawling/block-indexing
    robots: "noindex",
  };
};

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  return (
    <Document>
      <ErrorPage />
    </Document>
  );
}

function Document({ children }: { children: React.ReactNode }) {
  const matches = useMatches();
  const routeHandles = matches.map((match) => asRouteHandle(match.handle));
  const htmlBackgroundColor = routeHandles
    .map((handle) => handle.htmlBackgroundColor)
    .find((color) => color != null);
  const isFullHeight = routeHandles.some((handle) => handle.isFullHeight);

  return (
    <html
      lang="fr"
      className={cn(htmlBackgroundColor ?? "bg-gray-50", {
        "h-full": isFullHeight,
      })}
    >
      <head>
        <Meta />
        <Links />
      </head>

      <body
        className={cn(
          // Make sure children with absolute positionning are correctly placed.
          "relative",
          { "h-full": isFullHeight },
          "antialiased text-gray-800 text-body-default flex flex-col"
        )}
      >
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
