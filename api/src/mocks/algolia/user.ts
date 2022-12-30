import { Hit, SearchResponse } from "@algolia/client-search";
import { Prisma } from "@prisma/client";
import { prisma } from "../../core/db";
import { UserFromAlgolia, USER_INDEX_NAME } from "../../entities/user.entity";
import {
  createBatchHandlers,
  createPostHandlers,
  highlightValue,
} from "./shared";

export const userHandlers = [
  ...createPostHandlers(
    `/1/indexes/${USER_INDEX_NAME}/query`,
    async (req, res, ctx) => {
      const body = await req.json();
      const query = body.query || "";

      const where: Prisma.UserWhereInput = {
        ...(query !== "" && {
          OR: [
            { displayName: { contains: query } },
            { email: { contains: query } },
          ],
        }),
      };

      const users = await prisma.user.findMany({
        where,
        orderBy: [{ displayName: "asc" }, { email: "asc" }],
      });

      const responseBody: SearchResponse<UserFromAlgolia> = {
        nbHits: users.length,
        page: 0,
        nbPages: 1,
        hitsPerPage: users.length,
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

  ...createBatchHandlers(`/1/indexes/${USER_INDEX_NAME}/batch`),
];
