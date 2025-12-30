import { DynamicImage } from "#i/core/data-display/image";
import { ImageData } from "#i/core/image/data.js";
import { cn } from "@animeaux/core";
import { Link } from "@remix-run/react";
import { forwardRef } from "react";
import type { Except } from "type-fest";

export const ProviderItem = forwardRef<
  React.ComponentRef<"li">,
  Except<React.ComponentPropsWithoutRef<"li">, "children"> & {
    provider: { logoPath: string; name: string; url: string };
    imageSizes: React.ComponentPropsWithoutRef<typeof DynamicImage>["sizes"];
    imageFallbackSize: React.ComponentPropsWithoutRef<
      typeof DynamicImage
    >["fallbackSize"];
  }
>(function ProviderItem(
  { provider, imageFallbackSize, imageSizes, className, ...props },
  ref,
) {
  return (
    <li {...props} ref={ref} className={cn("grid grid-cols-1", className)}>
      <Link
        to={provider.url}
        className="group/item grid grid-cols-1 overflow-hidden rounded-2 border border-alabaster focus-visible:focus-spaced"
      >
        <DynamicImage
          image={ImageData.parse(provider.logoPath)}
          fillTransparentBackground
          alt={provider.name}
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
