import { DynamicImage } from "#core/data-display/image";
import { ImageUrl, cn } from "@animeaux/core";
import { Link } from "@remix-run/react";
import { forwardRef } from "react";
import type { Except } from "type-fest";

export const SponsorItem = forwardRef<
  React.ComponentRef<"li">,
  Except<React.ComponentPropsWithoutRef<"li">, "children"> & {
    sponsor: { logoPath: string; name: string; url: string };
    imageSizes: React.ComponentPropsWithoutRef<typeof DynamicImage>["sizes"];
    imageFallbackSize: React.ComponentPropsWithoutRef<
      typeof DynamicImage
    >["fallbackSize"];
    isSmall?: boolean;
  }
>(function SponsorItem(
  {
    sponsor,
    isSmall = false,
    imageFallbackSize,
    imageSizes,
    className,
    ...props
  },
  ref,
) {
  return (
    <li {...props} ref={ref} className={cn("grid grid-cols-1", className)}>
      <Link
        to={sponsor.url}
        className={cn(
          "group/item grid grid-cols-1 overflow-hidden focus-visible:focus-spaced",
          isSmall ? "rounded-1" : "rounded-2 border border-alabaster",
        )}
      >
        <DynamicImage
          image={ImageUrl.parse(sponsor.logoPath)}
          fillTransparentBackground
          alt={sponsor.name}
          aspectRatio="4:3"
          objectFit="contain"
          fallbackSize={imageFallbackSize}
          sizes={imageSizes}
          className="w-full transition-transform duration-slow can-hover:group-hover/item:scale-105"
        />
      </Link>
    </li>
  );
});
