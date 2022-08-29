import { useMatches } from "@remix-run/react";
import invariant from "tiny-invariant";
import { LoaderData } from "~/root";

export type Config = {
  publicHost: string;
  animeauxUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  ticketingUrl: string;
  exhibitorsFormUrl: string;
  pressReleaseUrl: string;
};

export function useConfig(): Config {
  const matches = useMatches();
  const match = matches.find((match) => match.id === "root");
  invariant(match != null && match.data != null, "A root match must exists");
  return (match.data as LoaderData).config;
}
