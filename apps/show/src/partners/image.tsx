import { DynamicImage } from "~/core/dataDisplay/image";

export function PartnersImage(
  props: Omit<
    React.ComponentPropsWithoutRef<typeof DynamicImage>,
    "alt" | "aspectRatio" | "image" | "title"
  >
) {
  return (
    <DynamicImage
      {...props}
      image={{ id: "/show/4bd88df0-c000-4d87-a403-f01393c16a47" }}
      alt="Partenaires du salon."
      title="L’Arbre Vert, NeoVoice"
      aspectRatio="16:9"
    />
  );
}
