import { actionClassNames } from "~/core/actions";
import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { useConfig } from "~/core/config";
import { Icon, IconProps } from "~/generated/icon";
import meaux from "~/images/meaux.png";
import nameAndLogo from "~/images/nameAndLogo.svg";
import paysDeMeaux from "~/images/paysDeMeaux.png";
import poullain from "~/images/poullain.png";
import villeAnimaux2Pattes from "~/images/villeAnimaux2Pattes.png";
import { LineShapeHorizontal } from "~/layout/lineShape";

export function Footer() {
  const { animeauxUrl, pressReleaseUrl } = useConfig();

  return (
    <footer
      className={cn(
        "w-full pt-[72px] px-page pb-12 flex flex-col items-center gap-12",
        "md:py-12"
      )}
    >
      <div className={cn("w-full px-2 flex", "md:px-6")}>
        <LineShapeHorizontal
          className={cn("w-full h-4 text-gray-300", "md:h-6")}
        />
      </div>

      <div
        className={cn(
          "w-full flex flex-col items-center gap-12",
          "md:flex-row"
        )}
      >
        <section
          className={cn(
            "max-w-md px-6 grid grid-cols-2 grid-rows-[auto] gap-x-12 gap-y-6 items-center",
            "md:min-w-0 md:max-w-none md:flex-1"
          )}
        >
          <img src={meaux} alt="Ville de Meaux" />
          <img
            src={villeAnimaux2Pattes}
            alt="Ville amie des animaux, 2 pattes"
          />
          <img src={paysDeMeaux} alt="Pays de Meaux" />
          <img src={poullain} alt="Jardinerie Poullain" />
        </section>

        <section
          className={cn(
            "max-w-md px-4 flex flex-col items-start gap-6",
            "md:max-w-none md:flex-1 md:min-w-0 md:px-6"
          )}
        >
          <img
            src={nameAndLogo}
            alt="Salon des Ani'Meaux"
            className={cn("h-[60px]", "md:h-20")}
          />

          <ul className="flex flex-col">
            <ContactItem icon="phone" to="tel:+33612194392">
              06 12 19 43 92
            </ContactItem>

            <ContactItem icon="envelope" to="mailto:salon@animeaux.org">
              salon@animeaux.org
            </ContactItem>

            <ContactItem icon="newspaper" to={pressReleaseUrl}>
              Communiqué de presse
            </ContactItem>
          </ul>

          <p>
            Le Salon des Ani'Meaux est organisé par{" "}
            <BaseLink
              to={animeauxUrl}
              className={actionClassNames.proseInline()}
            >
              l'association Ani'Meaux
            </BaseLink>{" "}
            au Colisée de Meaux, les 10 et 11 juin 2023 de 10h à 18h.
          </p>
        </section>
      </div>

      <section
        className={cn(
          "max-w-md px-4 py-6 flex flex-col text-gray-500 text-center",
          "md:max-w-none md:w-full md:p-6"
        )}
      >
        <p className="text-caption-default">
          Copyright © {new Date().getFullYear()} Ani'Meaux
        </p>
      </section>
    </footer>
  );
}

function ContactItem({
  icon,
  to,
  children,
}: {
  icon: IconProps["id"];
  to: NonNullable<BaseLinkProps["to"]>;
  children: string;
}) {
  return (
    <li className="flex">
      <BaseLink
        to={to}
        className="group flex items-start gap-2 hover:text-black"
      >
        <span className="h-6 flex items-center">
          <Icon
            id={icon}
            className="text-gray-500 text-[14px] group-hover:text-gray-800"
          />
        </span>

        <span>{children}</span>
      </BaseLink>
    </li>
  );
}
