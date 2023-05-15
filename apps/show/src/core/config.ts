import { SerializeFrom } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { loader as rootLoader } from "~/root";

export type Config = {
  animeauxUrl: string;
  carpoolFacebookGroupUrl: string;
  cloudinaryName: string;
  facebookUrl: string;
  googleTagManagerId?: string;
  instagramUrl: string;
  kidWorkshopRegistrationUrl: string;
  pressReleaseUrl: string;
  publicHost: string;
  ticketingUrl: string;
};

export function useConfig(): Config {
  const data = useRouteLoaderData("root");
  invariant(data != null, "A root data must exists");
  return (data as SerializeFrom<typeof rootLoader>).config;
}
