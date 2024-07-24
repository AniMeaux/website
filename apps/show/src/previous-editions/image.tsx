import { DynamicImage } from "#core/data-display/image";

export function PreviousEditionImage(
  props: Omit<
    React.ComponentPropsWithoutRef<typeof DynamicImage>,
    "alt" | "aspectRatio" | "image" | "title"
  >,
) {
  return (
    <DynamicImage
      {...props}
      image={{
        id: "/show/previous-editions-tgihza",
        blurhash: "UJM?bs=D4m-pH=E2D+E100%gSjsl~Xs+I.xv",
      }}
      alt="Des visiteurs regardant le panneau des adoptions."
      title="Julia Pommé Photographe"
      aspectRatio="1:1"
    />
  );
}
