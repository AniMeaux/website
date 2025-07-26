import { ServiceAnimation } from "#animations/service.server.js";
import type { Services } from "#core/services/service.server";
import { ServiceExhibitor } from "#exhibitors/service.server";
import { ServiceSponsor } from "#partners/service.server";
import { ServiceProvider } from "#providers/service.server";
import type { FileStorage } from "@animeaux/file-storage/server";
import {
  FileStorageGoogleDrive,
  FileStorageMock,
} from "@animeaux/file-storage/server";

class ServicesImpl implements Services {
  readonly animation: ServiceAnimation;
  readonly fileStorage: FileStorage;
  readonly exhibitor: ServiceExhibitor;
  readonly sponsor: ServiceSponsor;
  readonly provider: ServiceProvider;

  constructor() {
    this.animation = new ServiceAnimation(this);

    if (
      process.env.GOOGLE_API_CLIENT_EMAIL != null &&
      process.env.GOOGLE_API_PRIVATE_KEY != null
    ) {
      this.fileStorage = new FileStorageGoogleDrive({
        clientEmail: process.env.GOOGLE_API_CLIENT_EMAIL,
        privateKey: process.env.GOOGLE_API_PRIVATE_KEY,
      });
    } else {
      this.fileStorage = new FileStorageMock();
    }

    this.exhibitor = new ServiceExhibitor(this);
    this.sponsor = new ServiceSponsor(this);
    this.provider = new ServiceProvider(this);
  }
}

export const services = new ServicesImpl();
