import { algolia } from "#core/algolia/algolia.server";
import {
  EmailAlreadyUsedError,
  NotFoundError,
  PrismaErrorCodes,
  ReferencedError,
} from "#core/errors.server";
import { prisma } from "#core/prisma.server";
import type { FosterFamilyHit } from "@animeaux/algolia-client";
import type { FosterFamily } from "@prisma/client";
import { FosterFamilyAvailability, Prisma } from "@prisma/client";
import { DateTime } from "luxon";
import invariant from "tiny-invariant";

export class MissingSpeciesToHostError extends Error {}
export class InvalidAvailabilityDateError extends Error {}

export class FosterFamilyDbDelegate {
  async fuzzySearch({
    displayName,
    isBanned,
    maxHitCount,
  }: {
    displayName?: string;
    isBanned?: boolean;
    maxHitCount: number;
  }): Promise<
    (FosterFamilyHit &
      Pick<FosterFamily, "availability" | "city" | "zipCode">)[]
  > {
    // Don't use Algolia when there are no text search.
    if (displayName == null) {
      const fosterFamilies = await prisma.fosterFamily.findMany({
        where: {
          isBanned: isBanned ?? undefined,
        },
        select: {
          availability: true,
          city: true,
          displayName: true,
          id: true,
          isBanned: true,
          zipCode: true,
        },
        orderBy: { displayName: "asc" },
        take: maxHitCount,
      });

      return fosterFamilies.map((fosterFamily) => ({
        ...fosterFamily,
        _highlighted: {
          displayName: fosterFamily.displayName,
          isBanned: fosterFamily.isBanned,
        },
      }));
    }

    const hits = await algolia.fosterFamily.findMany({
      where: { displayName, isBanned },
      hitsPerPage: maxHitCount,
    });

    const fosterFamilies = await prisma.fosterFamily.findMany({
      where: { id: { in: hits.map((hit) => hit.id) } },
      select: {
        availability: true,
        city: true,
        id: true,
        isBanned: true,
        zipCode: true,
      },
    });

    return hits.map((hit) => {
      const fosterFamily = fosterFamilies.find(
        (fosterFamily) => fosterFamily.id === hit.id,
      );
      invariant(
        fosterFamily != null,
        "Foster family from algolia should exists.",
      );

      return { ...hit, ...fosterFamily };
    });
  }

  async delete(fosterFamilyId: FosterFamily["id"]) {
    await prisma.$transaction(async (prisma) => {
      try {
        await prisma.fosterFamily.delete({ where: { id: fosterFamilyId } });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          switch (error.code) {
            case PrismaErrorCodes.NOT_FOUND: {
              throw new NotFoundError();
            }

            case PrismaErrorCodes.FOREIGN_KEY_CONSTRAINT_FAILED: {
              throw new ReferencedError();
            }
          }
        }

        throw error;
      }

      await algolia.fosterFamily.delete(fosterFamilyId);
    });
  }

  async setIsBanned(fosterFamilyId: FosterFamily["id"], isBanned: boolean) {
    await prisma.$transaction(async (prisma) => {
      try {
        await prisma.fosterFamily.update({
          where: { id: fosterFamilyId },
          data: {
            isBanned,
            availability: isBanned ? "UNAVAILABLE" : "UNKNOWN",
            availabilityExpirationDate: null,
          },
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCodes.NOT_FOUND) {
            throw new NotFoundError();
          }
        }

        throw error;
      }

      await algolia.fosterFamily.update({ id: fosterFamilyId, isBanned });
    });
  }

  async update(id: FosterFamily["id"], data: FosterFamilyData) {
    await prisma.$transaction(async (prisma) => {
      const fosterFamily = await prisma.fosterFamily.findUnique({
        where: { id },
        select: { speciesToHost: true },
      });
      if (fosterFamily == null) {
        throw new NotFoundError();
      }

      this.validate(data, fosterFamily);
      this.normalize(data);

      try {
        await prisma.fosterFamily.update({ where: { id }, data });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED) {
            throw new EmailAlreadyUsedError();
          }
        }

        throw error;
      }

      await algolia.fosterFamily.update({ ...data, id });
    });
  }

  async create(data: FosterFamilyData) {
    return await prisma.$transaction(async (prisma) => {
      this.validate(data);
      this.normalize(data);

      try {
        const fosterFamily = await prisma.fosterFamily.create({
          data,
          select: { id: true, isBanned: true },
        });

        await algolia.fosterFamily.create({
          ...data,
          id: fosterFamily.id,
          isBanned: fosterFamily.isBanned,
        });

        return fosterFamily.id;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED) {
            throw new EmailAlreadyUsedError();
          }
        }

        throw error;
      }
    });
  }

  private validate(
    newData: FosterFamilyData,
    currentData?: null | Pick<FosterFamily, "speciesToHost">,
  ) {
    if (newData.speciesToHost.length === 0) {
      // Allow old foster family (without species to host) to be updated without
      // setting them. But we can't unset them.
      if (currentData == null || currentData.speciesToHost.length > 0) {
        throw new MissingSpeciesToHostError();
      }
    }

    if (
      newData.availability !== FosterFamilyAvailability.UNKNOWN &&
      newData.availabilityExpirationDate != null
    ) {
      if (
        DateTime.fromJSDate(newData.availabilityExpirationDate) <
        DateTime.now().startOf("day")
      ) {
        throw new InvalidAvailabilityDateError();
      }
    }
  }

  private normalize(data: FosterFamilyData) {
    if (data.availability === FosterFamilyAvailability.UNKNOWN) {
      data.availabilityExpirationDate = null;
    }
  }
}

type FosterFamilyData = Pick<
  FosterFamily,
  | "address"
  | "availability"
  | "availabilityExpirationDate"
  | "city"
  | "comments"
  | "displayName"
  | "garden"
  | "housing"
  | "email"
  | "phone"
  | "speciesAlreadyPresent"
  | "speciesToHost"
  | "zipCode"
>;
