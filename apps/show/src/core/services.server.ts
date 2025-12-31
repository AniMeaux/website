import { ServiceAnimation } from "#i/animations/service.server.js";
import { ServiceCache } from "#i/core/cache.service.server.js";
import { ServiceEmailConsole } from "#i/core/email/service.console.server.js";
import { ServiceEmailResend } from "#i/core/email/service.resend.server.js";
import type { ServiceEmail } from "#i/core/email/service.server.js";
import { ServiceBlurhash } from "#i/core/image/blurhash.service.server.js";
import { ServiceImageCloudinary } from "#i/core/image/service.cloudinary.server.js";
import { ServiceImageMock } from "#i/core/image/service.mock.server.js";
import type { ServiceImage } from "#i/core/image/service.server.js";
import { ServicePrisma } from "#i/core/prisma.service.server.js";
import { ServiceDividerType } from "#i/divider-type/service.server.js";
import { ServiceApplicationEmail } from "#i/exhibitors/application/email.service.server.js";
import { ServiceApplication } from "#i/exhibitors/application/service.server.js";
import { ModuleExhibitorEmail } from "#i/exhibitors/email.module.server.js";
import { ServiceExhibitor } from "#i/exhibitors/service.server.js";
import { ServiceInvoiceEmail } from "#i/invoice/email.service.server.js";
import { ServiceInvoice } from "#i/invoice/service.server.js";
import { ServiceProvider } from "#i/providers/service.server.js";
import { ServiceSponsor } from "#i/sponsors/service.server.js";
import { ServiceStandSize } from "#i/stand-size/service.server.js";
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

  dividerType = new ServiceDividerType(this.prisma);

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

  invoice = new ServiceInvoice(this.prisma);

  invoiceEmail = new ServiceInvoiceEmail(
    this.email,
    this.exhibitor,
    this.application,
    this.invoice,
  );
}

export const services = new ServicesRootModule();
