import type { Services } from "#core/services/service.server";
import { ServiceExhibitor } from "#exhibitors/service.server";
import { GoogleClient } from "@animeaux/google-client/server";

class ServicesImpl implements Services {
  readonly drive: GoogleClient;
  readonly exhibitor: ServiceExhibitor;

  constructor() {
    this.drive = new GoogleClient(
      process.env.GOOGLE_API_CLIENT_EMAIL != null &&
      process.env.GOOGLE_API_PRIVATE_KEY != null
        ? {
            clientEmail: process.env.GOOGLE_API_CLIENT_EMAIL,
            privateKey: process.env.GOOGLE_API_PRIVATE_KEY,
          }
        : undefined,
    );

    this.exhibitor = new ServiceExhibitor(this);
  }
}

export const services = new ServicesImpl();
