import { json, LinksFunction, LoaderFunction } from "@remix-run/node";
import { getPageTitle } from "~/core/pageTitle";
import { theme } from "~/generated/theme";
import googleTouchIcon from "~/images/googleTouchIcon.png";

// Make sure `googleTouchIcon.png` is added to the build assets.
// It looks like an asset only used on the server won't be included in the
// assets build folder.
export const links: LinksFunction = () => {
  return [{ rel: "preconnect", href: googleTouchIcon }];
};

export const loader: LoaderFunction = () => {
  return json({
    name: getPageTitle(),
    short_name: getPageTitle(),
    background_color: theme.colors.gray[50],
    theme_color: theme.colors.blue.base,
    display: "standalone",
    scope: "/",
    start_url: "/?source=pwa",
    icons: [
      {
        src: googleTouchIcon,
        type: "image/png",
        sizes: "512x512",
      },
      {
        src: googleTouchIcon,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  });
};
