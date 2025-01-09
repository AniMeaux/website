import type { Services } from "#core/services/service.server";
import { ServiceExhibitor } from "#exhibitors/service.server";
import { ServicePartner } from "#partners/service.server";
import { ServiceProvider } from "#providers/service.server";
import { GoogleClient } from "@animeaux/google-client/server";

class ServicesImpl implements Services {
  readonly drive: GoogleClient;
  readonly exhibitor: ServiceExhibitor;
  readonly partner: ServicePartner;
  readonly provider: ServiceProvider;

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
    this.partner = new ServicePartner(this);
    this.provider = new ServiceProvider(this);
  }
}

export const services = new ServicesImpl();
