import type { ServiceEmail } from "#core/email/service.server.js";
import type { ServiceApplication } from "#exhibitors/application/service.server.js";
import { ServiceExhibitorDocumentEmail } from "#exhibitors/documents/email.service.server.js";
import { ServiceExhibitorDogConfigurationEmail } from "#exhibitors/dogs-configuration/email.service.server.js";
import {
  ServiceExhibitorDescriptionEmail,
  ServiceExhibitorOnStandAnimationEmail,
  ServiceExhibitorPublicProfileEmail,
} from "#exhibitors/profile/email.service.server.js";
import type { ServiceExhibitor } from "#exhibitors/service.server.js";
import { ServiceExhibitorStandConfigurationEmail } from "#exhibitors/stand-configuration/email.service.server.js";
import { ServiceExhibitorVisibilityEmail } from "#exhibitors/visibility-email.service.server.js";

export class ModuleExhibitorEmail {
  document: ServiceExhibitorDocumentEmail;
  dogConfiguration: ServiceExhibitorDogConfigurationEmail;
  publicProfile: ServiceExhibitorPublicProfileEmail;
  description: ServiceExhibitorDescriptionEmail;
  onStandAnimation: ServiceExhibitorOnStandAnimationEmail;
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

    this.standConfiguration = new ServiceExhibitorStandConfigurationEmail(
      email,
      exhibitor,
      application,
    );

    this.visibility = new ServiceExhibitorVisibilityEmail(email, application);
  }
}
