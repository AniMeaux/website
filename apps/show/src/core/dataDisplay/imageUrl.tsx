import { SearchParamsDelegate } from "@animeaux/form-data";
import { zu } from "@animeaux/zod-utils";
import { createPath } from "@remix-run/react";
import invariant from "tiny-invariant";

export type ImageData = {
  id: string;
  blurhash?: string;
};

export const ImageUrl = {
  parse(image: string): ImageData {
    const [id, searchParams] = image.split("?");
    invariant(id != null, "The image should exists");

    const { blurhash } = BlurhashSearchParams.parse(
      new URLSearchParams(searchParams),
    );

    return { id, blurhash };
  },

  stringify(image: ImageData) {
    return createPath({
      pathname: image.id,
      search: BlurhashSearchParams.stringify({ blurhash: image.blurhash }),
    });
  },
};

const BlurhashSearchParams = SearchParamsDelegate.create({
  blurhash: zu.searchParams.string(),
});
