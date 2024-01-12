import type { DynamicImageProps } from "#core/dataDisplay/image";
import { DynamicImage } from "#core/dataDisplay/image";
import { ImageUrl } from "#core/dataDisplay/imageUrl";
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
          "group overflow-hidden border border-alabaster grid grid-cols-1 focus-visible:outline-none focus-visible:ring focus-visible:ring-mystic focus-visible:ring-offset-2 focus-visible:ring-offset-inheritBg",
          isSmall ? "rounded-1" : "rounded-2",
        )}
      >
        <DynamicImage
          image={ImageUrl.parse(partner.image)}
          alt={partner.name}
          aspectRatio="4:3"
          objectFit="cover"
          fallbackSize={fallbackSize}
          sizes={sizes}
          className="w-full group-hover:scale-105 transition-transform duration-150 ease-in-out"
        />
      </Link>
    </li>
  );
}
