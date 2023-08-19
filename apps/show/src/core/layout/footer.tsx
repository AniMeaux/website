import { Link } from "@remix-run/react";
import { Action, ProseInlineAction } from "~/core/actions";
import { useConfig } from "~/core/config";
import { DynamicImage } from "~/core/dataDisplay/image";
import { hasShowEnded } from "~/core/dates";
import { FooterWave } from "~/core/layout/footerWave";
import { LegalBackground } from "~/core/layout/legalBackground";
import { Section } from "~/core/layout/section";
import { Routes } from "~/core/navigation";
import { Icon } from "~/generated/icon";
import { Pictogram } from "~/generated/pictogram";
import logoAniMeaux from "~/images/logoAniMeaux.svg";
import { PartnersImage } from "~/partners/image";

export function Footer() {
  return (
    <footer className="grid grid-cols-1">
      <AccessSection />
      <LinksSection />
      <LegalSection />
    </footer>
  );
}

function AccessSection() {
  const { ticketingUrl } = useConfig();

  return (
    <section className="relative px-page-narrow md:px-page-normal py-4 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 lg:gap-8 md:items-end">
      <FooterWave className="absolute -z-10 left-0 bottom-0 w-full h-[53px] md:h-[90px]" />

      <Section.TextAside className="rounded-2 bg-alabaster bg-var-alabaster p-2">
        <Section.Title>Économisez, soutenez, profitez !</Section.Title>

        <p>
          En achetant vos billets à l’avance, vous bénéficiez d’un tarif
          avantageux, vous évitez les files d’attente aux guichets à votre
          arrivée et vous apportez votre soutien à l’association organisatrice
          du salon !
        </p>

        {hasShowEnded() ? null : (
          <Section.Action asChild>
            <Action asChild color="mystic">
              <Link to={ticketingUrl}>Achetez votre billet</Link>
            </Action>
          </Section.Action>
        )}
      </Section.TextAside>

      <Section.ImageAside className="w-full aspect-4/3">
        <DynamicImage
          image={{ id: "/show/ae7c7389-eb8a-4b19-bc18-a8c504f410c5" }}
          alt="Chien"
          fallbackSize="512"
          sizes={{ default: "384px", md: "50vw", lg: "464px" }}
          aspectRatio="none"
          className="absolute top-0 left-0 w-full"
        />
      </Section.ImageAside>
    </section>
  );
}

function LinksSection() {
  const {
    animeauxUrl,
    facebookUrl,
    instagramUrl,
    partnersFormUrl,
    pressReleaseUrl,
  } = useConfig();

  return (
    <section className="bg-paleBlue bg-var-paleBlue px-page-narrow md:px-page-normal py-4 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-2 sm:gap-4 lg:gap-8 md:items-center">
      <Section.TextAside className="justify-self-center md:justify-self-stretch max-w-sm md:max-w-none">
        <PartnersImage
          fallbackSize="512"
          sizes={{ default: "384px", md: "50vw", lg: "341px" }}
          className="w-full"
        />

        <Section.Action asChild isCentered>
          <Action asChild color="prussianBlue">
            <Link to={partnersFormUrl}>Devenez partenaire</Link>
          </Action>
        </Section.Action>
      </Section.TextAside>

      <img
        src={logoAniMeaux}
        alt="Association Ani’Meaux"
        className="justify-self-center md:justify-self-stretch w-[150px] aspect-square"
      />

      <Section.TextAside className="justify-self-center md:justify-self-stretch max-w-sm md:max-w-none">
        <div className="grid grid-flow-col justify-start gap-1">
          <SocialLink to={facebookUrl}>
            <Pictogram id="facebook" className="text-[24px]" />
          </SocialLink>

          <SocialLink to={instagramUrl}>
            <Pictogram id="instagram" className="text-[24px]" />
          </SocialLink>
        </div>

        <ul className="grid grid-cols-1">
          <ContactItem icon="boldCall" to="tel:+33612194392">
            06 12 19 43 92
          </ContactItem>

          <ContactItem icon="boldSms" to="mailto:salon@animeaux.org">
            salon@animeaux.org
          </ContactItem>

          <ContactItem icon="boldGlobal" to={pressReleaseUrl}>
            Communiqué de presse
          </ContactItem>

          <ContactItem icon="boldGallery" to={Routes.previousEditions()}>
            Éditions précédentes
          </ContactItem>
        </ul>

        <p>
          Le Salon des Ani’Meaux est organisé par l'association{" "}
          <ProseInlineAction asChild>
            <Link to={animeauxUrl}>Ani’Meaux</Link>
          </ProseInlineAction>{" "}
          au Colisée de Meaux, les 8 et 9 juin 2024 de 10h à 18h.
        </p>
      </Section.TextAside>
    </section>
  );
}

function SocialLink(
  props: Omit<React.ComponentPropsWithoutRef<typeof Link>, "className">
) {
  return (
    <Link
      {...props}
      className="rounded-full grid grid-cols-1 transition-transform duration-100 ease-in-out hover:scale-105 active:scale-95 hover:active:scale-95 focus-visible:outline-none focus-visible:ring focus-visible:ring-prussianBlue focus-visible:ring-offset-2 focus-visible:ring-offset-inheritBg"
    />
  );
}

function ContactItem({
  icon,
  to,
  children,
}: {
  icon: React.ComponentProps<typeof Icon>["id"];
  to: NonNullable<React.ComponentProps<typeof Link>["to"]>;
  children: string;
}) {
  return (
    <li className="grid grid-cols-1 justify-items-start">
      <Link
        to={to}
        prefetch="intent"
        className="rounded-0.5 grid grid-cols-[auto_auto] items-start gap-1 transition-[color,transform] duration-100 ease-in-out hover:text-mystic active:scale-95 focus-visible:outline-none focus-visible:ring focus-visible:ring-mystic focus-visible:ring-offset-2 focus-visible:ring-offset-inheritBg"
      >
        <span className="h-2 flex items-center">
          <Icon id={icon} className="text-[16px] text-mystic" />
        </span>

        <span>{children}</span>
      </Link>
    </li>
  );
}

function LegalSection() {
  return (
    <section className="relative z-10 px-page-narrow md:px-page-normal py-2 grid grid-cols-1">
      <LegalBackground className="absolute -z-10 top-0 left-0 w-full h-full" />

      <p className="text-caption-lowercase-emphasis text-white text-center">
        Copyright © {new Date().getFullYear()} Ani’Meaux
      </p>
    </section>
  );
}
