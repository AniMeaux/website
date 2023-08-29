import { DynamicImage } from "#core/dataDisplay/image.tsx";

export function AccessImage(
  props: Omit<
    React.ComponentPropsWithoutRef<typeof DynamicImage>,
    "alt" | "aspectRatio" | "image" | "title"
  >,
) {
  return (
    <DynamicImage
      {...props}
      image={{
        id: "/show/d9abb32b-c6f4-4ab4-af8b-a4cc2e2f228e",
        blurhash: "UPO||Q~CNGxc~CnpR$xY$-NXj=Rmj^R~oOoc",
      }}
      alt="Carte d’accès au Colisée de Meaux."
      aspectRatio="1:1"
    />
  );
}
