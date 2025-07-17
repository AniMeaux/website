import { GoogleClient } from "@animeaux/file-storage/server";

export const googleClient = new GoogleClient(
  process.env.GOOGLE_API_CLIENT_EMAIL != null &&
  process.env.GOOGLE_API_PRIVATE_KEY != null
    ? {
        clientEmail: process.env.GOOGLE_API_CLIENT_EMAIL,
        privateKey: process.env.GOOGLE_API_PRIVATE_KEY,
      }
    : undefined,
);
