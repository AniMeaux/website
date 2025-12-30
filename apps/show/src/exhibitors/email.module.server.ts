import type { ServiceEmail } from "#i/core/email/service.server.js";
import { ServiceExhibitorOnStandAnimationEmail } from "#i/exhibitors/animations/email.service.server";
import type { ServiceApplication } from "#i/exhibitors/application/service.server.js";
import { ServiceExhibitorDocumentEmail } from "#i/exhibitors/documents/email.service.server.js";
import { ServiceExhibitorDogConfigurationEmail } from "#i/exhibitors/dogs-configuration/email.service.server.js";
import { ServiceExhibitorPerksEmail } from "#i/exhibitors/perks/email.service.server";
import {
  ServiceExhibitorDescriptionEmail,
  ServiceExhibitorPublicProfileEmail,
} from "#i/exhibitors/profile/email.service.server.js";
import type { ServiceExhibitor } from "#i/exhibitors/service.server.js";
import { ServiceExhibitorStandConfigurationEmail } from "#i/exhibitors/stand-configuration/email.service.server.js";
import { ServiceExhibitorVisibilityEmail } from "#i/exhibitors/visibility-email.service.server.js";

export class ModuleExhibitorEmail {
  document: ServiceExhibitorDocumentEmail;
  dogConfiguration: ServiceExhibitorDogConfigurationEmail;
  publicProfile: ServiceExhibitorPublicProfileEmail;
  description: ServiceExhibitorDescriptionEmail;
  onStandAnimation: ServiceExhibitorOnStandAnimationEmail;
  perks: ServiceExhibitorPerksEmail;
  standConfiguration: ServiceExhibitorStandConfigurationEmail;
  visibility: ServiceExhibitorVisibilityEmail;

  constructor(
    email: ServiceEmail,
    exhibitor: ServiceExhibitor,
    application: ServiceApplication,
  ) {
    this.document = new ServiceExhibitorDocumentEmail(
      email,
      exhibitor,
      application,
    );

    this.dogConfiguration = new ServiceExhibitorDogConfigurationEmail(
      email,
      exhibitor,
      application,
    );

    this.publicProfile = new ServiceExhibitorPublicProfileEmail(
      email,
      exhibitor,
      application,
    );

    this.description = new ServiceExhibitorDescriptionEmail(
      email,
      exhibitor,
      application,
    );

    this.onStandAnimation = new ServiceExhibitorOnStandAnimationEmail(
      email,
      exhibitor,
      application,
    );

    this.perks = new ServiceExhibitorPerksEmail(email, exhibitor, application);

    this.standConfiguration = new ServiceExhibitorStandConfigurationEmail(
      email,
      exhibitor,
      application,
    );

    this.visibility = new ServiceExhibitorVisibilityEmail(email, application);
  }
}
