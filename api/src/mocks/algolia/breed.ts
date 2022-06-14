import { Hit, SearchResponse } from "@algolia/client-search";
import { Prisma } from "@prisma/client";
import invariant from "tiny-invariant";
import { prisma } from "../../core/db";
import {
  BreedFromAlgolia,
  BREED_INDEX_NAME,
} from "../../entities/animalBreed.entity";
import {
  createBatchHandlers,
  createPostHandlers,
  highlightValue,
} from "./shared";

export const breedHandlers = [
  ...createPostHandlers(
    `/1/indexes/${BREED_INDEX_NAME}/query`,
    async (req, res, ctx) => {
      invariant(
        req.headers.get("content-type") === "application/x-www-form-urlencoded",
        "Content-Type must be application/x-www-form-urlencoded"
      );

      invariant(typeof req.body === "string", "Body must be a string");
      const body = JSON.parse(req.body);
      const query = body.query || "";

      const where: Prisma.BreedWhereInput = {
        name: query === "" ? undefined : { contains: query },
      };

      const breeds = await prisma.breed.findMany({
        where,
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          species: true,
        },
      });

      const responseBody: SearchResponse<BreedFromAlgolia> = {
        nbHits: breeds.length,
        page: 0,
        nbPages: 1,
        hitsPerPage: breeds.length,
        exhaustiveNbHits: true,
        query,
        params: "",
        renderingContent: {},
        processingTimeMS: 1,
        hits: breeds.map<Hit<BreedFromAlgolia>>((breed) => ({
          ...breed,
          objectID: breed.id,
          _highlightResult: {
            name: {
              value: highlightValue(breed.name, {
                search: query,
                highlightPreTag: body.highlightPreTag,
                highlightPostTag: body.highlightPostTag,
              }),
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

  ...createBatchHandlers(`/1/indexes/${BREED_INDEX_NAME}/batch`),
];
