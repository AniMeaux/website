import { LoaderData } from "#/root";
import { useMatches } from "@remix-run/react";
import invariant from "tiny-invariant";

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
  const matches = useMatches();
  const match = matches.find((match) => match.id === "root");
  invariant(match != null && match.data != null, "A root match must exists");
  return (match.data as LoaderData).config;
}
