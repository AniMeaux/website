import type { loader as rootLoader } from "#root.tsx";
import type { SerializeFrom } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

export type Config = {
  animeauxUrl: string;
  carpoolFacebookGroupUrl: string;
  cloudinaryName: string;
  exhibitorsFormUrl: string;
  facebookUrl: string;
  featureFlagShowExhibitors: boolean;
  featureFlagShowProgram: boolean;
  featureFlagSiteOnline: boolean;
  googleTagManagerId?: string;
  instagramUrl: string;
  kidWorkshopRegistrationUrl: string;
  partnersFormUrl: string;
  pressReleaseUrl: string;
  publicHost: string;
  raffleUrl: string;
  ticketingUrl: string;
};

export function useOptionalConfig(): undefined | Config {
  const data = useRouteLoaderData("root");
  if (data == null) {
    return undefined;
  }

  return (data as SerializeFrom<typeof rootLoader>).config;
}

export function useConfig(): Config {
  const config = useOptionalConfig();
  invariant(config != null, "A root data must exists");
  return config;
}
