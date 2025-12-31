import type { loader as rootLoader } from "#i/root";
import type { SerializeFrom } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

export type Config = {
  cloudinaryName: string;
  publicHost: string;
};

export function useConfig(): Config {
  const data = useRouteLoaderData("root");
  invariant(data != null, "A root data must exists");
  return (data as SerializeFrom<typeof rootLoader>).config;
}
