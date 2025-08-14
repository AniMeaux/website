import { ServiceAnimation } from "#animations/service.server.js";
import { ServiceCache } from "#core/cache.service.server.js";
import { ServiceEmailConsole } from "#core/email/service.console.server.js";
import { ServiceEmailResend } from "#core/email/service.resend.server.js";
import type { ServiceEmail } from "#core/email/service.server.js";
import { ServiceBlurhash } from "#core/image/blurhash.service.server.js";
import { ServiceImageCloudinary } from "#core/image/service.cloudinary.server.js";
import { ServiceImageMock } from "#core/image/service.mock.server.js";
import type { ServiceImage } from "#core/image/service.server.js";
import { ServicePrisma } from "#core/prisma.service.server.js";
import { ServiceApplicationEmail } from "#exhibitors/application/email.service.server.js";
import { ServiceApplication } from "#exhibitors/application/service.server.js";
import { ModuleExhibitorEmail } from "#exhibitors/email.module.server.js";
import { ServiceExhibitor } from "#exhibitors/service.server.js";
import { ServiceStandSize } from "#exhibitors/stand-size/service.server.js";
import { ServiceProvider } from "#providers/service.server.js";
import { ServiceSponsor } from "#sponsors/service.server.js";
import type { FileStorage } from "@animeaux/file-storage/server";
import {
  FileStorageGoogleDrive,
  FileStorageMock,
} from "@animeaux/file-storage/server";
import { captureException } from "@sentry/remix";

class ServicesRootModule {
  prisma = new ServicePrisma();

  cache = new ServiceCache();

  blurhash = new ServiceBlurhash();

  image: ServiceImage =
    process.env.CLOUDINARY_CLOUD_NAME !== "mock-cloud-name"
      ? new ServiceImageCloudinary(this.cache)
      : new ServiceImageMock();

  fileStorage: FileStorage =
    process.env.GOOGLE_API_CLIENT_EMAIL != null &&
    process.env.GOOGLE_API_PRIVATE_KEY != null
      ? new FileStorageGoogleDrive({
          clientEmail: process.env.GOOGLE_API_CLIENT_EMAIL,
          privateKey: process.env.GOOGLE_API_PRIVATE_KEY,
        })
      : new FileStorageMock();

  email: ServiceEmail =
    process.env.RESEND_API_KEY != null
      ? new ServiceEmailResend(process.env.RESEND_API_KEY, {
          useTestEmail:
            process.env.RUNTIME_ENV === "local" &&
            process.env.RESEND_ENABLE_LOCAL !== "true",

          onError: (error, { template, effectiveTo, textBody }) => {
            console.error("Could not send email:", error);

            const { body, ...templateWithoutBody } = template ?? {};

            captureException(new Error("Could not send email"), {
              extra: {
                error,
                template: { ...templateWithoutBody, effectiveTo, textBody },
              },
            });
          },
        })
      : new ServiceEmailConsole();

  standSize = new ServiceStandSize(this.prisma);

  animation = new ServiceAnimation(this.prisma);

  provider = new ServiceProvider(this.prisma);

  sponsor = new ServiceSponsor(this.prisma);

  application = new ServiceApplication(this.prisma, this.blurhash);

  applicationEmail = new ServiceApplicationEmail(this.email, this.application);

  exhibitor = new ServiceExhibitor(
    this.prisma,
    this.fileStorage,
    this.blurhash,
  );

  exhibitorEmail = new ModuleExhibitorEmail(
    this.email,
    this.exhibitor,
    this.application,
  );
}

export const services = new ServicesRootModule();
