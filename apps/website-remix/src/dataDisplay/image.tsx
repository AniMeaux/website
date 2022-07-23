export type ImageResolutions = {
  512: string;
  1024: string;
  1536: string;
  2048: string;
};

export function StaticImage({
  image,
  ...rest
}: Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {
  image: ImageResolutions;
}) {
  return (
    // Alt text is in the rest props.
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      {...rest}
      src={image[2048]}
      srcSet={[
        `${image[512]} 512w`,
        `${image[1024]} 1024w`,
        `${image[1536]} 1536w`,
        `${image[2048]} 2048w`,
      ].join(",")}
    />
  );
}
