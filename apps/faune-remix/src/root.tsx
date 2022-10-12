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
  useMatches,
} from "@remix-run/react";
import { cn } from "~/core/classNames";
import { Config } from "~/core/config";
import { createConfig } from "~/core/config.server";
import { ErrorPage } from "~/core/dataDisplay/errorPage";
import { getPageTitle } from "~/core/pageTitle";
import stylesheet from "~/generated/tailwind.css";
import { theme } from "~/generated/theme";
import appleTouchIcon from "~/images/appleTouchIcon.png";
import favicon from "~/images/favicon.svg";
import maskIcon from "~/images/maskIcon.svg";
import { asRouteHandle } from "./core/handles";

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

export type LoaderData = {
  config: Config;
};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({ config: createConfig() });
};

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
  const matches = useMatches();
  const htmlBackgroundColor = matches
    .map((match) => asRouteHandle(match.handle).htmlBackgroundColor)
    .find((color) => color != null);

  return (
    <html lang="fr" className={htmlBackgroundColor ?? "bg-gray-50"}>
      <head>
        <Meta />
        <Links />
      </head>

      <body
        className={cn(
          // Make sure children with absolute positionning are correctly placed.
          "relative",
          "antialiased text-gray-800 text-body-default grid grid-cols-1"
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
