import { actionClassNames } from "~/core/actions";
import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { useConfig } from "~/core/config";
import { Icon, IconProps } from "~/generated/icon";
import anideo from "~/images/anideo.png";
import arbreVert from "~/images/arbreVert.png";
import citronad from "~/images/citronad.png";
import evasion from "~/images/evasion.png";
import leroyMerlin from "~/images/leroyMerlin.png";
import leTraiteurImaginaire from "~/images/leTraiteurImaginaire.png";
import meaux from "~/images/meaux.png";
import nameAndLogo from "~/images/nameAndLogo.svg";
import neoVoice from "~/images/neoVoice.svg";
import paysDeMeaux from "~/images/paysDeMeaux.png";
import superlogo from "~/images/superlogo.png";
import villeAnimaux2Pattes from "~/images/villeAnimaux2Pattes.png";
import { LineShapeHorizontal } from "~/layout/lineShape";

export function Footer() {
  const { animeauxUrl, pressReleaseUrl } = useConfig();

  return (
    <footer
      className={cn(
        "w-full pt-18 px-page pb-12 flex flex-col items-center gap-24",
        "md:pt-12"
      )}
    >
      <LineShapeHorizontal
        className={cn("w-full h-4 text-gray-300", "md:h-6")}
      />

      <div
        className={cn(
          "w-full flex flex-col items-center gap-24",
          "md:flex-row"
        )}
      >
        <section
          className={cn(
            "grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-x-12 gap-y-6",
            "md:flex-1"
          )}
        >
          <LogoItem
            image={meaux}
            alt="Ville de Meaux"
            to="https://www.ville-meaux.fr"
          />

          <LogoItem
            image={villeAnimaux2Pattes}
            alt="Ville amie des animaux, 2 pattes"
            to="https://www.iledefrance.fr/sites/default/files/medias/2020/09/label%20ville%20amie%20des%20animaux.pdf"
          />

          <LogoItem
            image={paysDeMeaux}
            alt="Pays de Meaux"
            to="https://www.agglo-paysdemeaux.fr"
          />

          <LogoItem
            image={citronad}
            alt="Citron’ad"
            to="https://www.citron-ad.fr"
          />

          <LogoItem
            image={superlogo}
            alt="Super Logo"
            to="https://www.super-logo.com"
          />

          <LogoItem
            image={arbreVert}
            alt="L’Arbre Vert"
            to="https://www.arbrevert.fr"
          />

          <LogoItem image={anideo} alt="Anidéo" to="https://www.anideo.fr" />

          <LogoItem
            image={neoVoice}
            alt="NeoVoice"
            to="https://www.neovoice.fr"
          />

          <LogoItem
            image={leTraiteurImaginaire}
            alt="Le Traiteur Imaginaire"
            to="https://www.traiteur-imaginaire.com"
          />

          <LogoItem
            image={evasion}
            alt="EVASION"
            to="https://www.evasionfm.com"
          />

          <LogoItem
            image={leroyMerlin}
            alt="Leroy Merlin"
            to="https://www.leroymerlin.fr"
          />
        </section>

        <section className={cn("flex flex-col items-start gap-6", "md:flex-1")}>
          <img
            src={nameAndLogo}
            alt="Salon des Ani’Meaux"
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
            Le Salon des Ani’Meaux est organisé par{" "}
            <BaseLink
              to={animeauxUrl}
              className={actionClassNames.proseInline()}
            >
              l'association Ani’Meaux
            </BaseLink>{" "}
            au Colisée de Meaux, les 10 et 11 juin 2023 de 10h à 18h.
          </p>
        </section>
      </div>

      <section
        className={cn(
          "py-6 flex flex-col text-gray-500 text-center",
          "md:w-full"
        )}
      >
        <p className="text-caption-default">
          Copyright © {new Date().getFullYear()} Ani’Meaux
        </p>
      </section>
    </footer>
  );
}

function LogoItem({
  image,
  alt,
  to,
}: {
  image: string;
  alt: string;
  to: BaseLinkProps["to"];
}) {
  return (
    <BaseLink
      to={to}
      className="rounded-bubble-md flex items-center transition-transform duration-100 ease-in-out hover:scale-105"
    >
      <img
        src={image}
        alt={alt}
        className="w-full aspect-[2/1] object-contain"
      />
    </BaseLink>
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
