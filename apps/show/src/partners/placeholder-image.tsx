import { DynamicImage } from "#core/data-display/image";

export function PartnersPlaceholderImage(
  props: Omit<
    React.ComponentPropsWithoutRef<typeof DynamicImage>,
    "alt" | "aspectRatio" | "image" | "title"
  >,
) {
  return (
    <DynamicImage
      {...props}
      image={{ id: "/show/2bb4f949-4874-4d66-8822-30bf26ebde2c" }}
      alt="Partenaires du Salon des Ani’Meaux."
      title="Partenaires du Salon des Ani’Meaux."
      aspectRatio="16:9"
    />
  );
}
