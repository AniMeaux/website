import { NotFoundError, PrismaErrorCodes } from "#core/errors.server";
import { googleClient } from "#core/google-client.server";
import { notifyShowApp } from "#core/notification.server";
import { prisma } from "#core/prisma.server";
import { TABLE_COUNT_BY_SIZE } from "#show/applications/stand-size";
import type { ShowExhibitorApplication } from "@prisma/client";
import { Prisma, ShowExhibitorApplicationStatus } from "@prisma/client";

export class MissingRefusalMessageError extends Error {}

export class ShowExhibitorApplicationDbDelegate {
  async update(
    id: ShowExhibitorApplication["id"],
    data: ShowExhibitorApplicationData,
  ) {
    this.validate(data);
    this.normalize(data);

    await prisma.$transaction(async (prisma) => {
      let application: ShowExhibitorApplication;

      try {
        application = await prisma.showExhibitorApplication.update({
          where: { id },
          data,
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCodes.NOT_FOUND) {
            throw new NotFoundError();
          }
        }

        throw error;
      }

      if (
        data.status === ShowExhibitorApplicationStatus.VALIDATED &&
        application.exhibitorId == null
      ) {
        const folder = await googleClient.createFolder(
          application.structureName,
          { parentFolderId: process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID },
        );

        await prisma.showExhibitor.create({
          data: {
            ...(application.partnershipCategory != null
              ? {
                  partnership: {
                    create: {
                      category: application.partnershipCategory,
                    },
                  },
                }
              : {}),

            application: { connect: { id } },

            documents: { create: { folderId: folder.id } },

            dogsConfiguration: { create: {} },

            profile: {
              create: {
                activityTargets: application.structureActivityTargets,
                activityFields: application.structureActivityFields,
                links: [application.structureUrl],
                logoPath: application.structureLogoPath,
                name: application.structureName,
              },
            },

            standConfiguration: {
              create: {
                size: application.desiredStandSize,
                tableCount: TABLE_COUNT_BY_SIZE[application.desiredStandSize],
              },
            },
          },
        });
      }
    });

    await notifyShowApp({
      type: "application-status-updated",
      applicationId: id,
    });
  }

  private validate(newData: ShowExhibitorApplicationData) {
    if (
      newData.status === ShowExhibitorApplicationStatus.REFUSED &&
      newData.refusalMessage == null
    ) {
      throw new MissingRefusalMessageError();
    }
  }

  normalize(data: ShowExhibitorApplicationData) {
    if (data.status !== ShowExhibitorApplicationStatus.REFUSED) {
      data.refusalMessage = null;
    }
  }
}

type ShowExhibitorApplicationData = Pick<
  ShowExhibitorApplication,
  "status" | "refusalMessage"
>;
