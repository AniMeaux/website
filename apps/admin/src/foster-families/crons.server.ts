import { ActivityAction } from "#activity/action.js";
import { Activity } from "#activity/db.server.js";
import { ActivityResource } from "#activity/resource.js";
import type { CronDefinition } from "#core/crons/shared.server";
import { prisma } from "#core/prisma.server";
import type { Prisma, PrismaClient } from "@animeaux/prisma/server";
import { FosterFamilyAvailability } from "@animeaux/prisma/server";
import { DateTime } from "luxon";

export const ExpireFosterFamilyAvailabilityCron: CronDefinition = {
  name: "Expire foster family availability",

  pattern: "@daily",

  async fn() {
    const today = DateTime.now().startOf("day").toJSDate();

    const count = await prisma.$transaction(async (prisma) => {
      const fosterFamilies = await prisma.fosterFamily.findMany({
        where: {
          availability: {
            in: [
              FosterFamilyAvailability.AVAILABLE,
              FosterFamilyAvailability.UNAVAILABLE,
            ],
          },
          availabilityExpirationDate: { lt: today },
        },
        select: fosterFamilySelect,
      });

      await Promise.allSettled(
        fosterFamilies.map((fosterFamily) =>
          toggleAvailability(prisma, fosterFamily),
        ),
      );

      return fosterFamilies.length;
    });

    console.log("Updated availability of", count, "foster families");
  },
};

const fosterFamilySelect = {
  id: true,
  updatedAt: true,
  availability: true,
  availabilityExpirationDate: true,
} satisfies Prisma.FosterFamilySelect;

async function toggleAvailability(
  prisma: Pick<PrismaClient, "fosterFamily">,
  currentFosterFamily: Prisma.FosterFamilyGetPayload<{
    select: typeof fosterFamilySelect;
  }>,
) {
  const newFosterFamily = await prisma.fosterFamily.update({
    where: { id: currentFosterFamily.id },
    data: {
      availability:
        currentFosterFamily.availability === FosterFamilyAvailability.AVAILABLE
          ? FosterFamilyAvailability.UNAVAILABLE
          : FosterFamilyAvailability.AVAILABLE,

      availabilityExpirationDate: null,
    },
    select: fosterFamilySelect,
  });

  await Activity.create({
    cronId: "foster-family-availability",
    action: ActivityAction.Enum.UPDATE,
    resource: ActivityResource.Enum.FOSTER_FAMILY,
    resourceId: currentFosterFamily.id,
    before: currentFosterFamily,
    after: newFosterFamily,
  });
}
