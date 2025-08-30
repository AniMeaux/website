import { SearchParamsIO } from "@animeaux/search-params-io";
import { createPath, parsePath } from "@remix-run/react";
import invariant from "tiny-invariant";

export type ImageData = {
  id: string;
  blurhash?: string;
};

export namespace ImageData {
  export function parse(imageData: string): ImageData {
    const path = parsePath(imageData);
    invariant(path.pathname != null, "The image should exists");

    const { blurhash } = blurhashSearchParams.parse(
      new URLSearchParams(path.search),
    );

    return { id: path.pathname, blurhash };
  }

  export function stringify(imageData: ImageData) {
    return createPath({
      pathname: imageData.id,
      search: blurhashSearchParams.format({ blurhash: imageData.blurhash }),
    });
  }

  const blurhashSearchParams = SearchParamsIO.create({
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
}
