import { algolia } from "#core/algolia/algolia.server";
import {
  AlreadyExistError,
  NotFoundError,
  PrismaErrorCodes,
  ReferencedError,
} from "#core/errors.server";
import { prisma } from "#core/prisma.server";
import type { Color } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { fuzzySearchColors } from "@prisma/client/sql";
import invariant from "tiny-invariant";

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
  }) {
    // When there are no text search, return hits ordered by name.
    if (name == null) {
      return await prisma.color.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
        take: maxHitCount,
      });
    }

    const hits = await prisma.$queryRawTyped(
      fuzzySearchColors(name, maxHitCount),
    );

    const colors = await prisma.color.findMany({
      where: { id: { in: hits.map((hit) => hit.id) } },
      select: { id: true, name: true },
    });

    return hits.map((hit) => {
      const color = colors.find((color) => color.id === hit.id);
      invariant(color != null, "color hit should exists.");

      return color;
    });
  }
}

type ColorData = Pick<Color, "name">;
