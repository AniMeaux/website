import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react";
import { getPageTitle } from "~/core/pageTitle";
import { ErrorPage } from "~/dataDisplay/errorPage";
import stylesheet from "~/generated/tailwind.css";
import appleTouchIcon from "~/images/appleTouchIcon.png";
import favicon from "~/images/favicon.svg";
import maskIcon from "~/images/maskIcon.svg";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesheet },
    { rel: "manifest", href: "/manifest.json" },
    { rel: "icon", href: favicon },
    { rel: "mask-icon", href: maskIcon, color: "#0078bf" },
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
      href: "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap",
    },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: getPageTitle(),
  "theme-color": "#f9fafb",

  // Use `maximum-scale=1` to prevent browsers to zoom on form elements.
  viewport:
    "width=device-width, minimum-scale=1, initial-scale=1, maximum-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover",
});

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
    <html lang="fr" className="bg-gray-50">
      <head>
        <Meta />
        <Links />
      </head>

      <body className="min-h-screen text-gray-800">
        {children}

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
