import { cn } from "#core/classNames.ts";
import { createConfig } from "#core/config.server.ts";
import { ErrorPage } from "#core/dataDisplay/errorPage.tsx";
import { asRouteHandle } from "#core/handles.ts";
import { getPageTitle } from "#core/pageTitle.ts";
import { theme } from "#generated/theme.ts";
import appleTouchIcon from "#images/appleTouchIcon.png";
import favicon from "#images/favicon.svg";
import maskIcon from "#images/maskIcon.svg";
import stylesheet from "#tailwind.css";
import type { LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
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

export const meta: V2_MetaFunction = () => {
  return [{ title: getPageTitle() }];
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
        <meta charSet="utf-8" />
        <meta name="theme-color" content={theme.colors.white} />

        {/* We don't want it to be index by search engines. */}
        {/* See https://developers.google.com/search/docs/advanced/crawling/block-indexing */}
        <meta name="robots" content="noindex" />

        {/* Use `maximum-scale=1` to prevent browsers to zoom on form elements. */}
        <meta
          name="viewport"
          content="width=device-width, minimum-scale=1, initial-scale=1, maximum-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />

        <Meta />
        <Links />
      </head>

      <body
        className={cn(
          // Make sure children with absolute positionning are correctly placed.
          "relative",
          { "h-full": isFullHeight },
          "text-gray-800 text-body-default flex flex-col",
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
