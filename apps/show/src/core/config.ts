import { useRouteLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { LoaderData } from "~/root";

export type Config = {
  animeauxUrl: string;
  cloudinaryName: string;
  facebookUrl: string;
  googleTagManagerId?: string;
  instagramUrl: string;
  pressReleaseUrl: string;
  publicHost: string;
  ticketingUrl: string;
};

export function useConfig(): Config {
  const data = useRouteLoaderData("root");
  invariant(data != null, "A root data must exists");
  return (data as LoaderData).config;
}
