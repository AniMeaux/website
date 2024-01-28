import { algolia } from "#core/algolia/algolia.server";
import { prisma } from "#core/prisma.server";
import {
  createBatchHandlers,
  createPostHandlers,
  highlightValue,
} from "#mocks/algolia/shared.server";
import type { Hit, SearchResponse } from "@algolia/client-search";
import type { SerializeObject, User } from "@animeaux/algolia-client";
import type { Prisma } from "@prisma/client";
import { promiseHash } from "remix-utils/promise";

export const userHandlers = [
  ...createPostHandlers(
    `/1/indexes/${algolia.user.index.indexName}/query`,
    async (req, res, ctx) => {
      const body = await req.json();
      const query = body.query || "";
      const page = body.page ?? 0;

      const where: Prisma.UserWhereInput = {};
      if (query !== "") {
        where.displayName = { contains: query, mode: "insensitive" };
      }

      const { totalCount, users } = await promiseHash({
        totalCount: prisma.user.count({ where }),
        users: prisma.user.findMany({
          where,
          orderBy: { displayName: "asc" },
          take: body.hitsPerPage,
          skip: page * body.hitsPerPage,
          select: {
            displayName: true,
            email: true,
            groups: true,
            id: true,
            isDisabled: true,
          },
        }),
      });

      const responseBody: SearchResponse<SerializeObject<User>> = {
        nbHits: totalCount,
        page,
        nbPages: Math.ceil(totalCount / body.hitsPerPage),
        hitsPerPage: body.hitsPerPage,
        exhaustiveNbHits: true,
        query,
        params: "",
        renderingContent: {},
        processingTimeMS: 1,
        hits: users.map<Hit<SerializeObject<User>>>((user) => ({
          ...user,
          objectID: user.id,
          _highlightResult: {
            displayName: {
              value: highlightValue(user.displayName, { search: query }),
              matchLevel: "full",
              fullyHighlighted: true,
              matchedWords: [],
            },
            email: {
              value: highlightValue(user.email, { search: query }),
              matchLevel: "full",
              fullyHighlighted: true,
              matchedWords: [],
            },
          },
        })),
      };

      return res(ctx.json(responseBody));
    },
  ),

  ...createBatchHandlers(`/1/indexes/${algolia.user.index.indexName}/batch`),
];
