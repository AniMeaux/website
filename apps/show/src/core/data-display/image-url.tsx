import { SearchParamsIO } from "@animeaux/search-params-io";
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
      search: BlurhashSearchParams.format({ blurhash: image.blurhash }),
    });
  },
};

const BlurhashSearchParams = SearchParamsIO.create({
  keys: { blurhash: "blurhash" },

  parseFunction: (searchParams, keys) => {
    const blurhash = searchParams.get(keys.blurhash)?.trim() || undefined;
    return { blurhash };
  },

  setFunction: (searchParams, data, keys) => {
    if (data.blurhash == null) {
      searchParams.delete(keys.blurhash);
      return;
    }

    searchParams.set(keys.blurhash, data.blurhash);
  },
});
