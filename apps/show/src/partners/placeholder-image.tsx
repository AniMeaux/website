import { DynamicImage } from "#core/data-display/image";
import { forwardRef } from "react";
import type { Except } from "type-fest";

export const PartnersPlaceholderImage = forwardRef<
  React.ComponentRef<typeof DynamicImage>,
  Except<
    React.ComponentPropsWithoutRef<typeof DynamicImage>,
    "alt" | "aspectRatio" | "image" | "title"
  >
>(function PartnersPlaceholderImage(props, ref) {
  return (
    <DynamicImage
      {...props}
      ref={ref}
      image={{ id: "/show/partenaires-placeholder_ma4otz" }}
      alt="Sponsors du Salon des Ani’Meaux."
      title="Sponsors du Salon des Ani’Meaux."
      aspectRatio="16:9"
    />
  );
});
