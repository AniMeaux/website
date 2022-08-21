import invariant from "tiny-invariant";
import { Config } from "~/core/config";

export function createConfig(): Config {
  invariant(process.env.PUBLIC_HOST, "PUBLIC_HOST should be defined");

  return {
    publicHost: process.env.PUBLIC_HOST,
  };
}
