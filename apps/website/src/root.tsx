import "#i/tailwind.css"

import { cn } from "@animeaux/core"
import type { LinksFunction, MetaFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "@remix-run/react"
import { Settings } from "luxon"

import { ErrorPage } from "#i/core/data-display/error-page.js"
import { Footer } from "#i/core/layout/footer.js"
import { Header } from "#i/core/layout/header.js"
import { createSocialMeta } from "#i/core/meta.js"
import { getPageTitle, pageDescription } from "#i/core/page-title.js"
import { theme } from "#i/generated/theme.js"
import appleTouchIcon from "#i/images/apple-touch-icon.png"
import favicon from "#i/images/favicon.svg"
import { socialImages } from "#i/images/social.js"

// Display dates in French.
Settings.defaultLocale = "fr"

// All "day dates" should be inferred as in Paris time zone.
// Ex: 2022-01-01 => 2021-12-31T23:00:00.000Z and not 2021-01-01T00:00:00.000Z
Settings.defaultZone = "Europe/Paris"

// We're not supposed to have invalid date objects.
// Use null or undefined instead.
Settings.throwOnInvalid = true
declare module "luxon" {
  interface TSSettings {
    throwOnInvalid: true
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
  ]
}

export async function loader() {
  return json({ CLIENT_ENV: global.CLIENT_ENV })
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  // The data can be null in case of error.
  const CLIENT_ENV = data?.CLIENT_ENV

  let imageUrl: string | undefined = undefined
  if (CLIENT_ENV != null) {
    imageUrl = `${CLIENT_ENV.PUBLIC_HOST}${socialImages.default.imagesBySize[1024]}`
  }

  return createSocialMeta({
    title: getPageTitle(),
    description: pageDescription,
    imageUrl,
  })
}

export default function App() {
  const { CLIENT_ENV } = useLoaderData<typeof loader>()

  return (
    <Document
      googleTagManagerId={CLIENT_ENV.GOOGLE_TAG_MANAGER_ID}
      publicHost={CLIENT_ENV.PUBLIC_HOST}
    >
      <Header />
      <Outlet />
      <Footer />

      <GlobalClientEnv clientEnv={CLIENT_ENV} />
    </Document>
  )
}

export function ErrorBoundary() {
  return (
    <Document>
      <ErrorPage isStandAlone />

      <GlobalClientEnv />
    </Document>
  )
}

function Document({
  children,
  googleTagManagerId,
  publicHost,
}: {
  children: React.ReactNode
  googleTagManagerId?: string
  publicHost?: string
}) {
  const location = useLocation()

  let url = publicHost
  if (url != null && location.pathname !== "/") {
    url = `${url}${location.pathname}`
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
  )
}

function GlobalClientEnv({ clientEnv = {} }: { clientEnv?: object }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.CLIENT_ENV = ${JSON.stringify(clientEnv)};`,
      }}
    />
  )
}

function GoogleTagManagerScript({ id }: { id: string }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`,
      }}
    />
  )
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
  )
}
