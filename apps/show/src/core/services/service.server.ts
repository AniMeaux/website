import type { ServiceExhibitor } from "#exhibitors/service.server";
import type { GoogleClient } from "@animeaux/google-client/server";

export interface Services {
  readonly drive: GoogleClient;
  readonly exhibitor: ServiceExhibitor;
}

export abstract class Service {
  protected readonly services: Services;

  constructor(services: Services) {
    this.services = services;
  }
}
