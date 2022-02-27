import getNextConfig from "next/config";

export type Config = {
  apiUrl: string;
  cloudinaryCloudName: string;
  sentryDsn: string;
};

// `getNextConfig` is only typed with `any`.
type NextConfig = { publicRuntimeConfig: Config };

export function getConfig() {
  return (getNextConfig() as NextConfig).publicRuntimeConfig;
}
