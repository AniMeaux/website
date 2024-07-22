import type { CloudinaryApiResponse } from "#core/cloudinary/shared.server";
import { SearchParamsReader } from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";
import { HttpResponse, http } from "msw";
import { v4 as uuid } from "uuid";

export const cloudinaryHandlers = [
  http.get(
    "https://api.cloudinary.com/v1_1/mock-cloud-name/resources/image/upload",
    async ({ request }) => {
      const searchParams = SearchParams.parse(
        new URL(request.url).searchParams,
      );

      const endIndex = Math.min(
        RESOURCE_COUNT,
        searchParams.nextIndex + searchParams.maxResults,
      );

      const response: CloudinaryApiResponse = {
        next_cursor: endIndex === RESOURCE_COUNT ? undefined : String(endIndex),
        resources: Array.from(
          { length: endIndex - searchParams.nextIndex },
          () => ({ public_id: uuid(), width: 8000, height: 8000, bytes: 1024 }),
        ),
      };

      return HttpResponse.json(response);
    },
  ),
];

const RESOURCE_COUNT = 200;

const SearchParams = SearchParamsReader.create({
  keys: { maxResults: "max_results", nextIndex: "next_cursor" },

  parseFunction: (searchParams, keys) => {
    return Schema.parse({
      maxResults: SearchParamsReader.getValue(searchParams, keys.maxResults),
      nextIndex: SearchParamsReader.getValue(searchParams, keys.nextIndex),
    });
  },
});

const Schema = zu.object({
  maxResults: zu.searchParams.number().pipe(
    zu
      .number()
      .int()
      .min(0)
      // Cloudinary default value.
      // https://cloudinary.com/documentation/admin_api#get_resources_optional_parameters
      .catch(10),
  ),

  nextIndex: zu.searchParams.number().pipe(zu.number().int().min(0).catch(0)),
});
