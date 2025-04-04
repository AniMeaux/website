import { createImageBlurhash } from "#core/blurhash.server";
import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server";
import { Service } from "#core/services/service.server";
import { ImageUrl } from "@animeaux/core";
import type { Prisma } from "@prisma/client";
import { ShowExhibitorProfileStatus } from "@prisma/client";
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

  async getByExhibitor<T extends Prisma.ShowExhibitorProfileSelect>(
    exhibitorId: string,
    params: { select: T },
  ) {
    const profile = await prisma.showExhibitorProfile.findUnique({
      where: { exhibitorId },
      select: params.select,
    });

    if (profile == null) {
      throw notFound();
    }

    return profile;
  }

  async updatePublicProfile(token: string, data: ExhibitorPublicProfileData) {
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
      data: {
        updatedAt: new Date(),

        profile: {
          update: {
            ...data,
            publicProfileStatus: ShowExhibitorProfileStatus.AWAITING_VALIDATION,
          },
        },
      },
    });

    return true;
  }

  async updateDescription(token: string, data: ExhibitorDescriptionData) {
    await prisma.showExhibitor.update({
      where: { token },
      data: {
        updatedAt: new Date(),

        profile: {
          update: {
            ...data,
            descriptionStatus: ShowExhibitorProfileStatus.AWAITING_VALIDATION,
          },
        },
      },
    });

    return true;
  }

  async updateOnStandAnimations(
    token: string,
    data: ExhibitorOnStandAnimationsData,
  ) {
    await prisma.showExhibitor.update({
      where: { token },
      data: {
        updatedAt: new Date(),

        profile: {
          update: {
            ...data,
            onStandAnimationsStatus:
              ShowExhibitorProfileStatus.AWAITING_VALIDATION,
          },
        },
      },
    });

    return true;
  }
}

type ExhibitorPublicProfileData = Pick<
  Prisma.ShowExhibitorProfileUpdateInput,
  "activityFields" | "activityTargets" | "links" | "logoPath"
>;

type ExhibitorDescriptionData = Pick<
  Prisma.ShowExhibitorProfileUpdateInput,
  "description"
>;

type ExhibitorOnStandAnimationsData = Pick<
  Prisma.ShowExhibitorProfileUpdateInput,
  "onStandAnimations"
>;
