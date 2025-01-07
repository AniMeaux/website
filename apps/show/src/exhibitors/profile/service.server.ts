import { createImageBlurhash } from "#core/blurhash.server";
import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server";
import { Service } from "#core/services/service.server";
import { ImageUrl } from "@animeaux/core";
import type { Prisma } from "@prisma/client";
import { captureException } from "@sentry/remix";

export class ServiceProfile extends Service {
  async getByToken<T extends Prisma.ShowExhibitorProfileSelect>(
    token: string,
    params: { select: T },
  ) {
    const exhibitor = await prisma.showExhibitor.findUnique({
      where: { token },
      select: { profile: { select: params.select } },
    });

    if (exhibitor?.profile == null) {
      throw notFound();
    }

    return exhibitor.profile;
  }

  async update(token: string, data: ExhibitorProfileData) {
    const logoPath =
      typeof data.logoPath === "string" ? data.logoPath : data.logoPath?.set;

    if (logoPath != null) {
      try {
        const blurhash = await createImageBlurhash(logoPath);
        data.logoPath = ImageUrl.stringify({ id: logoPath, blurhash });
      } catch (error) {
        console.error(error);
        captureException(error, { extra: { logoPath } });
      }
    }

    await prisma.showExhibitor.update({
      where: { token },
      data: { profile: { update: data } },
    });

    return true;
  }
}

type ExhibitorProfileData = Pick<
  Prisma.ShowExhibitorProfileUpdateInput,
  | "activityFields"
  | "activityTargets"
  | "description"
  | "links"
  | "logoPath"
  | "onStandAnimations"
>;
