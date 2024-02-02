import type { DynamicImageProps } from "#core/data-display/image";
import { DynamicImage } from "#core/data-display/image";
import { ImageUrl } from "#core/data-display/image-url";
import { cn } from "@animeaux/core";
import type { ShowPartner } from "@prisma/client";
import { Link } from "@remix-run/react";

export function PartnerItem({
  partner,
  isSmall = false,
  fallbackSize,
  sizes,
  className,
}: Pick<DynamicImageProps, "fallbackSize" | "sizes"> & {
  partner: Pick<ShowPartner, "id" | "image" | "name" | "url">;
  isSmall?: boolean;
  className?: string;
}) {
  return (
    <li className={cn("grid grid-cols-1", className)}>
      <Link
        to={partner.url}
        className={cn(
          "group grid grid-cols-1 overflow-hidden focus-visible:outline-none focus-visible:ring focus-visible:ring-mystic focus-visible:ring-offset-2 focus-visible:ring-offset-inheritBg",
          isSmall ? "rounded-1" : "rounded-2 border border-alabaster",
        )}
      >
        <DynamicImage
          image={ImageUrl.parse(partner.image)}
          alt={partner.name}
          aspectRatio="4:3"
          objectFit="cover"
          fallbackSize={fallbackSize}
          sizes={sizes}
          className="w-full transition-transform duration-150 ease-in-out group-hover:scale-105"
        />
      </Link>
    </li>
  );
}
