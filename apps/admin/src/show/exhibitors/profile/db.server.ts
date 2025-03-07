import { PrismaErrorCodes } from "#core/errors.server";
import { notifyShowApp } from "#core/notification.server";
import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server";
import { ProfileStatus } from "#show/exhibitors/profile/status";
import type { ShowExhibitorProfile } from "@prisma/client";
import { Prisma } from "@prisma/client";

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
    this.#normalizePublicProfile(data);

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

    await notifyShowApp({
      type: "public-profile-treated",
      exhibitorId,
    });
  }

  #normalizePublicProfile(data: ShowExhibitorPublicProfileData) {
    if (data.publicProfileStatus !== ProfileStatus.Enum.TO_MODIFY) {
      data.publicProfileStatusMessage = null;
    }
  }

  async updateName(exhibitorId: string, data: ShowExhibitorNameData) {
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
  }

  async updateOnStandAnimations(
    exhibitorId: string,
    data: ShowExhibitorOnStandAnimationsData,
  ) {
    this.#normalizeOnStandAnimations(data);

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

    await notifyShowApp({
      type: "on-stand-animations-treated",
      exhibitorId,
    });
  }

  #normalizeOnStandAnimations(data: ShowExhibitorOnStandAnimationsData) {
    if (data.onStandAnimationsStatus !== ProfileStatus.Enum.TO_MODIFY) {
      data.onStandAnimationsStatusMessage = null;
    }
  }
}

type ShowExhibitorPublicProfileData = Pick<
  ShowExhibitorProfile,
  | "activityFields"
  | "activityTargets"
  | "links"
  | "publicProfileStatus"
  | "publicProfileStatusMessage"
>;

type ShowExhibitorNameData = Pick<ShowExhibitorProfile, "name">;

type ShowExhibitorOnStandAnimationsData = Pick<
  ShowExhibitorProfile,
  | "onStandAnimations"
  | "onStandAnimationsStatus"
  | "onStandAnimationsStatusMessage"
>;
