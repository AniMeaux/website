import { Routes } from "#i/core/navigation";
import { getPageTitle } from "#i/core/page-title";
import { theme } from "#i/generated/theme";
import googleTouchIconMac from "#i/images/google-touch-icon-mac.png";
import googleTouchIconMaskable from "#i/images/google-touch-icon-maskable.png";
import googleTouchIcon from "#i/images/google-touch-icon.png";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import Bowser from "bowser";

// Make sure images are added to the build assets.
// It looks like an asset only used on the server won't be included in the
// assets build folder.
export const links: LinksFunction = () => {
  return [
    { rel: "preconnect", href: googleTouchIcon },
    { rel: "preconnect", href: googleTouchIconMac },
    { rel: "preconnect", href: googleTouchIconMaskable },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const browser = Bowser.getParser(request.headers.get("user-agent") ?? "");
  const isDesktop = browser.getPlatformType() === "desktop";
  const isMacOS = browser.getOSName() === "macOS";

  return json({
    name: getPageTitle(),
    short_name: getPageTitle(),
    background_color: theme.colors.white,
    theme_color: theme.colors.blue[500],
    display: isDesktop ? "minimal-ui" : "standalone",
    scope: Routes.home.toString(),
    start_url: `${Routes.home.toString()}?source=pwa`,
    icons: [
      {
        src: isDesktop && isMacOS ? googleTouchIconMac : googleTouchIcon,
        type: "image/png",
        sizes: "512x512",
      },
      {
        src: googleTouchIconMaskable,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  });
}
