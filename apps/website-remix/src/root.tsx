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
import { cn } from "~/core/classNames";
import { getPageTitle } from "~/core/pageTitle";
import { ErrorPage } from "~/dataDisplay/errorPage";
import stylesheet from "~/generated/tailwind.css";
import appleTouchIcon from "~/images/appleTouchIcon.png";
import background from "~/images/background.svg";
import favicon from "~/images/favicon.svg";
import maskIcon from "~/images/maskIcon.svg";
import { Footer } from "~/layout/footer";
import { Header } from "~/layout/header";

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
      href: "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap",
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
