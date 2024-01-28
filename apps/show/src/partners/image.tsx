import { DynamicImage } from "#core/dataDisplay/image";

export function PartnersImage(
  props: Omit<
    React.ComponentPropsWithoutRef<typeof DynamicImage>,
    "alt" | "aspectRatio" | "image" | "title"
  >,
) {
  return (
    <DynamicImage
      {...props}
      image={{ id: "/show/2bb4f949-4874-4d66-8822-30bf26ebde2c" }}
      alt="Partenaires du salon."
      title="L’Arbre Vert, NeoVoice"
      aspectRatio="16:9"
    />
  );
}
