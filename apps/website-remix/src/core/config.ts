import { MetaFunction } from "@remix-run/node";
import { useMatches } from "@remix-run/react";
import invariant from "tiny-invariant";
import { LoaderData } from "~/root";

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
  teamingUrl: string;
  twitterUrl: string;
  volunteerFormUrl: string;
};

export function useConfig(): Config {
  const matches = useMatches();
  const match = matches.find((match) => match.id === "root");
  invariant(match != null, "A root match must exists");
  return (match.data as LoaderData).config;
}

export function getConfig(
  routeData: Parameters<MetaFunction>[0]["parentsData"]
) {
  const data = routeData["root"];
  invariant(data != null, "A root data must exists");
  return (data as LoaderData).config;
}
