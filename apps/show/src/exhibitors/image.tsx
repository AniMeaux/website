import { DynamicImage } from "#core/data-display/image";

export function ExhibitorsImage(
  props: Omit<
    React.ComponentPropsWithoutRef<typeof DynamicImage>,
    "alt" | "aspectRatio" | "image" | "title"
  >,
) {
  return (
    <DynamicImage
      {...props}
      image={{
        id: "/show/exhibitors-jehiq1",
        blurhash: "U3C$cgMd579Y^8jI?b^+Iu-;00M}01~W?Gs=",
      }}
      alt="Stands des exposants du salon."
      title="Julia Pommé Photographe"
      aspectRatio="1:1"
    />
  );
}
