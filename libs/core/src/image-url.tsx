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
    return {
      blurhash: SearchParamsIO.getValue(searchParams, keys.blurhash)?.trim(),
    };
  },

  setFunction: (searchParams, data, keys) => {
    SearchParamsIO.setValue(searchParams, keys.blurhash, data.blurhash);
  },
});
