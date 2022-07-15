import { json, LoaderFunction } from "@remix-run/node";
import googleTouchIcon from "~/images/googleTouchIcon.png";

export const loader: LoaderFunction = () => {
  return json({
    name: "Ani'Meaux",
    short_name: "Ani'Meaux",
    background_color: "#f9fafb",
    theme_color: "#0078bf",
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
