import { Hit, SearchResponse } from "@algolia/client-search";
import { Prisma } from "@prisma/client";
import { promiseHash } from "remix-utils";
import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/db.server";
import {
  createBatchHandlers,
  createPostHandlers,
  highlightValue,
} from "~/mocks/algolia/shared.server";
import { UserFromAlgolia } from "~/users/algolia.server";

export const userHandlers = [
  ...createPostHandlers(
    `/1/indexes/${algolia.user.indexName}/query`,
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

      const responseBody: SearchResponse<UserFromAlgolia> = {
        nbHits: totalCount,
        page,
        nbPages: Math.ceil(totalCount / body.hitsPerPage),
        hitsPerPage: body.hitsPerPage,
        exhaustiveNbHits: true,
        query,
        params: "",
        renderingContent: {},
        processingTimeMS: 1,
        hits: users.map<Hit<UserFromAlgolia>>((user) => ({
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
    }
  ),

  ...createBatchHandlers(`/1/indexes/${algolia.user.indexName}/batch`),
];
