import orderBy from "lodash.orderby";

export namespace CloudinaryImage {
  export const Size = {
    S_2048: "2048",
    S_1536: "1536",
    S_1024: "1024",
    S_512: "512",
    S_256: "256",
    S_128: "128",
  } as const;

  export type Size = (typeof Size)[keyof typeof Size];

  export const sizes = orderBy(
    Object.values(Size),
    (size) => Number(size),
    "desc",
  );

  /**
   * @see https://cloudinary.com/documentation/transformation_reference#ar_aspect_ratio
   */
  export const AspectRatio = {
    AR_NONE: "NONE",
    AR_1x1: "1:1",
    AR_4x3: "4:3",
    AR_16x9: "16:9",
    AR_16x10: "16:10",
  } as const;

  export type AspectRatio = (typeof AspectRatio)[keyof typeof AspectRatio];

  export const ObjectFit = {
    /**
     * @see https://cloudinary.com/documentation/transformation_reference#c_fill
     */
    COVER: "fill",

    /**
     * @see https://cloudinary.com/documentation/transformation_reference#c_fit
     */
    CONTAIN: "fit",
  } as const;

  export type ObjectFit = (typeof ObjectFit)[keyof typeof ObjectFit];

  /**
   * When using devtools to emulate different browsers, Cloudinary may return a
   * format that is unsupported by the main browser, so images may not display
   * as expected. For example, if using Chrome dev tools to emulate an iPhone
   * Safari browser, a JPEG-2000 may be returned, which Chrome does not support.
   *
   * @see https://cloudinary.com/documentation/image_transformations#f_auto
   * @see https://cloudinary.com/documentation/image_optimization#tips_and_considerations_for_using_f_auto
   */
  export const Format = {
    AUTO: "auto",
    JPG: "jpg",
  } as const;

  export type Format = (typeof Format)[keyof typeof Format];

  export function createMediaQuery(screenSizePx: string, width?: string) {
    return [`(min-width: ${screenSizePx})`, width].filter(Boolean).join(" ");
  }

  export function createUrl(
    cloudName: string,
    imageId: string,
    {
      aspectRatio = AspectRatio.AR_NONE,
      fillTransparentBackground = false,
      objectFit = ObjectFit.CONTAIN,
      format = Format.AUTO,
      size,
    }: {
      aspectRatio?: AspectRatio;
      objectFit?: ObjectFit;
      format?: Format;
      size?: Size;

      /**
       * Ensure transparent images have a background that hides the blurhash.
       */
      fillTransparentBackground?: boolean;
    } = {},
  ) {
    const transformations = [
      // https://cloudinary.com/documentation/image_optimization#automatic_quality_selection_q_auto
      "q_auto",

      `f_${format}`,
    ];

    if (size != null) {
      transformations.push(`w_${size}`);
    }

    if (aspectRatio !== AspectRatio.AR_NONE) {
      transformations.push(`ar_${aspectRatio}`, `c_${objectFit}`);
    }

    // Ensure transparent images have a background that hides the blurhash.
    if (fillTransparentBackground) {
      // https://cloudinary.com/documentation/transformation_reference#b_background
      transformations.push("b_white");
    }

    const transformationsStr = transformations.join(",");

    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationsStr}/${imageId}`;
  }
}
