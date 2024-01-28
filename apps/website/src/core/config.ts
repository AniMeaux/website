import type { loader as rootLoader } from "#root.tsx";
import type { SerializeFrom } from "@remix-run/node";
import type { MetaArgs } from "@remix-run/react";
import { useRouteLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

export type Config = {
  adoptionFormUrl: string;
  cloudinaryName: string;
  donationUrl: string;
  facebookUrl: string;
  fosterFamilyFormUrl: string;
  googleTagManagerId?: string;
  instagramUrl: string;
  linkedInUrl: string;
  paypalUrl: string;
  pickUpFormUrl: string;
  publicHost: string;
  showUrl: string;
  teamingUrl: string;
  twitterUrl: string;
  volunteerFormUrl: string;
};

export function useConfig(): Config {
  const data = useRouteLoaderData("root");
  invariant(data != null, "A root loader data must exists");
  return (data as SerializeFrom<typeof rootLoader>).config;
}

export function getConfigFromMetaMatches(matches: MetaArgs["matches"]) {
  const match = matches.find((match) => match.id === "root");
  invariant(match != null, "A root match must exists");
  return (match.data as SerializeFrom<typeof rootLoader>).config;
}
