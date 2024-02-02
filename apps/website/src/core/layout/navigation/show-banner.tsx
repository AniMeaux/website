import { BaseLink } from "#core/base-link";
import { useConfig } from "#core/config";
import { StaticImage } from "#core/data-display/image";
import { Icon } from "#generated/icon";
import { showLogoImages } from "#images/show-logo";
import { cn } from "@animeaux/core";

export function ShowBanner({ className }: { className?: string }) {
  const { showUrl } = useConfig();

  return (
    <BaseLink
      to={showUrl}
      className={cn(
        className,
        "flex items-center gap-3 bg-showBrandBlue-lightest px-page pb-2 text-showBrandBlue-darkest text-body-emphasis pt-safe-2 hover:text-showBrandBlue-darker md:gap-6",
      )}
    >
      <StaticImage
        image={showLogoImages}
        sizes={{ default: "40px" }}
        className="aspect-square w-10"
      />

      <p className="flex-auto">
        Salon des Ani’Meaux
        <span className="hidden md:inline">
          {" "}
          - 10 et 11 juin 2023 - Colisée de Meaux
        </span>
      </p>

      <p className="flex items-center gap-3 p-2">
        <span className="hidden md:inline">En savoir plus</span>
        <Icon id="arrow-right" className="text-[20px]" />
      </p>
    </BaseLink>
  );
}
