import { algolia } from "#core/algolia/algolia.server";
import {
  AlreadyExistError,
  NotFoundError,
  PrismaErrorCodes,
  ReferencedError,
} from "#core/errors.server";
import { prisma } from "#core/prisma.server";
import type { ColorHit } from "@animeaux/algolia-client";
import type { Color } from "@prisma/client";
import { Prisma } from "@prisma/client";

export class ColorDbDelegate {
  async create(data: ColorData) {
    await prisma.$transaction(async (prisma) => {
      try {
        const color = await prisma.color.create({
          data,
          select: { id: true },
        });

        await algolia.color.create({ ...data, id: color.id });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED) {
            throw new AlreadyExistError();
          }
        }

        throw error;
      }
    });
  }

  async update(id: Color["id"], data: ColorData) {
    await prisma.$transaction(async (prisma) => {
      try {
        await prisma.color.update({ where: { id }, data });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED) {
            throw new AlreadyExistError();
          }
        }

        throw error;
      }

      await algolia.color.update({ ...data, id });
    });
  }

  async delete(id: Color["id"]) {
    await prisma.$transaction(async (prisma) => {
      try {
        await prisma.color.delete({ where: { id } });
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

      await algolia.color.delete(id);
    });
  }

  async fuzzySearch({
    name,
    maxHitCount,
  }: {
    name?: string;
    maxHitCount: number;
  }): Promise<ColorHit[]> {
    // Don't use Algolia when there are no text search.
    if (name == null) {
      const colors = await prisma.color.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
        take: maxHitCount,
      });

      return colors.map((color) => ({
        ...color,
        _highlighted: { name: color.name },
      }));
    }

    return await algolia.color.findMany({
      where: { name },
      hitsPerPage: maxHitCount,
    });
  }
}

type ColorData = Pick<Color, "name">;
