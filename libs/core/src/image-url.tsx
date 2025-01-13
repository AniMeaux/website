import { SearchParamsIO } from "@animeaux/search-params-io";
import { createPath, parsePath } from "@remix-run/react";
import invariant from "tiny-invariant";

export type ImageData = {
  id: string;
  blurhash?: string;
};

export const ImageUrl = {
  parse(image: string): ImageData {
    const path = parsePath(image);
    invariant(path.pathname != null, "The image should exists");

    const { blurhash } = BlurhashSearchParams.parse(
      new URLSearchParams(path.search),
    );

    return { id: path.pathname, blurhash };
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

  parseFunction: ({ keys, getValue }) => {
    return {
      blurhash: getValue(keys.blurhash)?.trim(),
    };
  },

  setFunction: (data, { keys, setValue }) => {
    setValue(keys.blurhash, data.blurhash);
  },
});
