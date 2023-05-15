import { SerializeFrom } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { loader as rootLoader } from "~/root";

export type Config = {
  cloudinaryName: string;
  publicHost: string;
};

export function useConfig(): Config {
  const data = useRouteLoaderData("root");
  invariant(data != null, "A root data must exists");
  return (data as SerializeFrom<typeof rootLoader>).config;
}
