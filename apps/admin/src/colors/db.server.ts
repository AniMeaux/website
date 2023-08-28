import { algolia } from "#core/algolia/algolia.server.ts";
import {
  AlreadyExistError,
  NotFoundError,
  PrismaErrorCodes,
  ReferencedError,
} from "#core/errors.server.ts";
import { prisma } from "#core/prisma.server.ts";
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

        await algolia.color.create(color.id, { name: data.name });
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

      await algolia.color.update(id, { name: data.name });
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
  }) {
    // Don't use Algolia when there are no text search.
    if (name == null) {
      const colors = await prisma.color.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
        take: maxHitCount,
      });

      return colors.map((color) => ({
        ...color,
        highlightedName: color.name,
      }));
    }

    return await algolia.color.search({ name, hitsPerPage: maxHitCount });
  }
}

type ColorData = Pick<Color, "name">;
