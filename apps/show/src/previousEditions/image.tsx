import { DynamicImage } from "~/core/dataDisplay/image";

export function PreviousEditionImage(
  props: Omit<
    React.ComponentPropsWithoutRef<typeof DynamicImage>,
    "alt" | "aspectRatio" | "image" | "title"
  >
) {
  return (
    <DynamicImage
      {...props}
      image={{
        id: "/show/d5e8898b-d756-4942-a957-17ba782d2aa1",
        blurhash: "UDGuH~.T000000IAEMs;4n%2o~tRs9xD-;t7",
      }}
      alt="Des visiteurs regardant le panneau des adoptions."
      title="Julia Pommé Photographe"
      aspectRatio="1:1"
    />
  );
}
