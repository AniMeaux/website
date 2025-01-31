import { PrismaErrorCodes } from "#core/errors.server";
import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server";
import { ProfileStatus } from "#show/exhibitors/profile/status";
import { ImageUrl } from "@animeaux/core";
import { Prisma } from "@prisma/client";
import { captureException } from "@sentry/remix";

export class ShowExhibitorProfileDbDelegate {
  async findUniqueByExhibitor<T extends Prisma.ShowExhibitorProfileSelect>(
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

  async updatePublicProfile(
    exhibitorId: string,
    data: ShowExhibitorPublicProfileData,
  ) {
    this.normalizePublicProfile(data);

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

    try {
      await prisma.showExhibitor.update({
        where: { id: exhibitorId },
        data: {
          updatedAt: new Date(),
          profile: { update: data },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.NOT_FOUND) {
          throw notFound();
        }
      }

      throw error;
    }

    // await notifyShowApp({
    //   type: "stand-configuration-treated",
    //   exhibitorId,
    // });
  }

  normalizePublicProfile(data: ShowExhibitorPublicProfileData) {
    if (
      data.publicProfileStatus != null &&
      data.publicProfileStatus !== ProfileStatus.Enum.TO_MODIFY
    ) {
      data.publicProfileStatusMessage = null;
    }
  }
}

type ShowExhibitorPublicProfileData = Pick<
  Prisma.ShowExhibitorProfileUpdateInput,
  | "activityFields"
  | "activityTargets"
  | "links"
  | "logoPath"
  | "publicProfileStatus"
  | "publicProfileStatusMessage"
>;
