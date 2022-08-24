import invariant from "tiny-invariant";
import { Config } from "~/core/config";

export function createConfig(): Config {
  invariant(process.env.PUBLIC_HOST, "PUBLIC_HOST should be defined");
  invariant(process.env.ANIMEAUX_URL, "ANIMEAUX_URL should be defined");
  invariant(process.env.TICKETING_URL, "TICKETING_URL should be defined");
  invariant(process.env.FACEBOOK_URL, "FACEBOOK_URL should be defined");
  invariant(process.env.INSTAGRAM_URL, "INSTAGRAM_URL should be defined");
  invariant(
    process.env.EXHIBITORS_FORM_URL,
    "EXHIBITORS_FORM_URL should be defined"
  );

  return {
    publicHost: process.env.PUBLIC_HOST,
    animeauxUrl: process.env.ANIMEAUX_URL,
    ticketingUrl: process.env.TICKETING_URL,
    facebookUrl: process.env.FACEBOOK_URL,
    instagramUrl: process.env.INSTAGRAM_URL,
    exhibitorsFormUrl: process.env.EXHIBITORS_FORM_URL,
  };
}
