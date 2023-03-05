import { MetaFunction } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { LoaderData } from "~/root";

export type Config = {
  cloudinaryName: string;
  publicHost: string;
  sentryDsn?: string;
};

export function useConfig(): Config {
  const data = useRouteLoaderData("root");
  invariant(data != null, "A root data must exists");
  return (data as LoaderData).config;
}

export function getConfig(
  routeData: Parameters<MetaFunction>[0]["parentsData"]
) {
  const data = routeData["root"];
  invariant(data != null, "A root data must exists");
  return (data as LoaderData).config;
}
