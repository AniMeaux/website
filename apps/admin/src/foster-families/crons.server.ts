import type { CronDefinition } from "#core/crons/shared.server";
import { prisma } from "#core/prisma.server";
import { FosterFamilyAvailability } from "#foster-families/availability";
import { DateTime } from "luxon";
import { promiseHash } from "remix-utils/promise";

export const ExpireFosterFamilyAvailabilityCron: CronDefinition = {
  name: "Expire foster family availability",

  pattern: "@daily",

  async fn() {
    const today = DateTime.now().startOf("day").toJSDate();

    const { unavailable, available } = await promiseHash({
      unavailable: prisma.fosterFamily.updateMany({
        where: {
          availability: FosterFamilyAvailability.Enum.AVAILABLE,
          availabilityExpirationDate: { lt: today },
        },
        data: {
          availability: FosterFamilyAvailability.Enum.UNAVAILABLE,
          availabilityExpirationDate: null,
        },
      }),

      available: prisma.fosterFamily.updateMany({
        where: {
          availability: FosterFamilyAvailability.Enum.UNAVAILABLE,
          availabilityExpirationDate: { lt: today },
        },
        data: {
          availability: FosterFamilyAvailability.Enum.AVAILABLE,
          availabilityExpirationDate: null,
        },
      }),
    });

    const count = unavailable.count + available.count;

    console.log("Updated availability of", count, "foster families");
  },
};
