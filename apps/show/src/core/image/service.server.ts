import type { ImageData } from "#core/image/data.js";
import type { PreviousEdition } from "#previous-editions/previous-edition.js";
import type { FileUpload } from "@mjackson/form-data-parser";

export interface ServiceImage {
  createReversibleUpload: () => {
    upload: ServiceImage.Uploader;
    revert: ServiceImage.Reverter;
  };

  getAllImages: (edition: PreviousEdition) => Promise<ServiceImage.Image[]>;

  setBlurhash: (imageId: string, blurhash: string) => Promise<void>;
}

export namespace ServiceImage {
  export type Image = ImageData & {
    width: number;
    height: number;
  };

  export type Uploader = (
    fileUpload: FileUpload,
    params: { imageId: string },
  ) => Promise<File>;

  export type Reverter = () => Promise<
    undefined | { imageId: string; error: unknown }[]
  >;
}
