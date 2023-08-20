import { DynamicImage } from "#core/dataDisplay/image.tsx";

export function ExhibitorsImage(
  props: Omit<
    React.ComponentPropsWithoutRef<typeof DynamicImage>,
    "alt" | "aspectRatio" | "image" | "title"
  >
) {
  return (
    <DynamicImage
      {...props}
      image={{
        id: "/show/d7cc20a6-3cb7-4b57-a25c-f4a612ab5fa8",
        blurhash: "U5FO+L0000?[00EJ?t$m00^,RQk95QyD4;IA",
      }}
      alt="Stands des exposants du salon."
      title="Julia Pommé Photographe"
      aspectRatio="1:1"
    />
  );
}
