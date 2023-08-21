import { json, LinksFunction, LoaderArgs } from "@remix-run/node";
import Bowser from "bowser";
import { Routes } from "~/core/navigation";
import { getPageTitle } from "~/core/pageTitle";
import { theme } from "~/generated/theme";
import googleTouchIcon from "~/images/googleTouchIcon.png";
import googleTouchIconMac from "~/images/googleTouchIconMac.png";
import googleTouchIconMaskable from "~/images/googleTouchIconMaskable.png";

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

export async function loader({ request }: LoaderArgs) {
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
