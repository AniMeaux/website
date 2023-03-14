import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { useConfig } from "~/core/config";
import { StaticImage } from "~/dataDisplay/image";
import { Icon } from "~/generated/icon";
import { showLogoImages } from "~/images/showLogo";

export function ShowBanner({ className }: { className?: string }) {
  const { showUrl } = useConfig();

  return (
    <BaseLink
      to={showUrl}
      className={cn(
        className,
        "bg-showBrandBlue-lightest pt-safe-2 px-page pb-2 flex items-center gap-3 text-body-emphasis text-showBrandBlue-darkest hover:text-showBrandBlue-darker md:gap-6"
      )}
    >
      <StaticImage
        image={showLogoImages}
        sizes={{ default: "40px" }}
        className="w-10 aspect-square"
      />

      <p className="flex-auto">
        Salon des Ani’Meaux
        <span className="hidden md:inline">
          {" "}
          - 10 et 11 juin 2023 - Colisée de Meaux
        </span>
      </p>

      <p className="p-2 flex items-center gap-3">
        <span className="hidden md:inline">En savoir plus</span>
        <Icon id="arrowRight" className="text-[20px]" />
      </p>
    </BaseLink>
  );
}
