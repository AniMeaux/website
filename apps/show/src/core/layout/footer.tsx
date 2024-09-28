import { Action, ProseInlineAction } from "#core/actions/actions";
import { SocialLink } from "#core/actions/social-link";
import { useConfig } from "#core/config";
import { DynamicImage } from "#core/data-display/image";
import { hasShowEnded } from "#core/dates";
import { FooterWave } from "#core/layout/footer-wave";
import { LegalBackground } from "#core/layout/legal-background";
import { Section } from "#core/layout/section";
import { Routes } from "#core/navigation";
import { Icon } from "#generated/icon";
import { Pictogram } from "#generated/pictogram";
import logoAniMeaux from "#images/logo-ani-meaux.svg";
import { usePartners } from "#partners/data";
import { PartnerItem } from "#partners/item";
import { PartnersPlaceholderImage } from "#partners/placeholder-image";
import { Link } from "@remix-run/react";

export function Footer() {
  const { featureFlagSiteOnline } = useConfig();

  return (
    <footer className="grid grid-cols-1">
      {featureFlagSiteOnline ? <HintSection /> : <WaitingWaveSection />}
      {featureFlagSiteOnline ? <LinksSection /> : <WaitingLinksSection />}
      <LegalSection />
    </footer>
  );
}

function HintSection() {
  const { ticketingUrl } = useConfig();

  return (
    <section className="relative grid grid-cols-1 gap-2 px-page-narrow py-4 md:grid-cols-2 md:items-end md:gap-4 md:px-page-normal lg:gap-8">
      <FooterWave className="absolute bottom-0 left-0 -z-10 h-[53px] w-full md:h-[90px]" />

      <Section.TextAside className="rounded-2 bg-alabaster p-2">
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

      <Section.ImageAside className="aspect-4/3 w-full">
        <DynamicImage
          image={{ id: "/show/ae7c7389-eb8a-4b19-bc18-a8c504f410c5" }}
          alt="Chien"
          fallbackSize="512"
          sizes={{ default: "384px", md: "50vw", lg: "464px" }}
          aspectRatio="none"
          className="absolute left-0 top-0 w-full"
        />
      </Section.ImageAside>
    </section>
  );
}

function WaitingWaveSection() {
  return (
    <section className="grid grid-cols-1 pt-8">
      <FooterWave className="h-[53px] w-full md:h-[90px]" />
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

  const partners = usePartners();

  return (
    <section className="grid grid-cols-1 gap-4 bg-paleBlue px-page-narrow py-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:px-page-normal lg:gap-8">
      <Section.TextAside className="max-w-sm justify-self-center md:max-w-none md:justify-self-stretch">
        {partners.length === 0 ? (
          <PartnersPlaceholderImage
            fallbackSize="512"
            sizes={{ default: "384px", md: "50vw", lg: "341px" }}
            className="w-full"
          />
        ) : (
          <ul className="flex flex-wrap justify-center gap-1">
            {partners.map((partner) => (
              <PartnerItem
                key={partner.id}
                partner={partner}
                fallbackSize="128"
                isSmall
                sizes={{ default: "70px" }}
                className="w-[70px] flex-none"
              />
            ))}
          </ul>
        )}

        <Section.Action asChild isCentered>
          <Action asChild color="prussianBlue">
            <Link to={partnersFormUrl}>Devenez partenaire</Link>
          </Action>
        </Section.Action>
      </Section.TextAside>

      <img
        src={logoAniMeaux}
        alt="Association Ani’Meaux"
        className="aspect-square w-[150px] justify-self-center md:justify-self-stretch"
      />

      <Section.TextAside className="max-w-sm justify-self-center md:max-w-none md:justify-self-stretch">
        <div className="grid grid-flow-col justify-start gap-1">
          <SocialLink to={facebookUrl}>
            <Pictogram id="facebook" className="text-[24px]" />
          </SocialLink>

          <SocialLink to={instagramUrl}>
            <Pictogram id="instagram" className="text-[24px]" />
          </SocialLink>
        </div>

        <ul className="grid grid-cols-1">
          <ContactItem icon="phone-solid" to="tel:+33612194392">
            06 12 19 43 92
          </ContactItem>

          <ContactItem icon="envelope-solid" to="mailto:salon@animeaux.org">
            salon@animeaux.org
          </ContactItem>

          <ContactItem icon="newspaper-solid" to={pressReleaseUrl}>
            Communiqué de presse
          </ContactItem>

          <ContactItem icon="image-solid" to={Routes.previousEditions()}>
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

function WaitingLinksSection() {
  const { animeauxUrl, facebookUrl, instagramUrl } = useConfig();

  return (
    <section className="grid grid-cols-1 gap-4 bg-paleBlue px-page-narrow py-4 md:grid-cols-2 md:items-center md:px-page-normal lg:gap-8">
      <img
        src={logoAniMeaux}
        alt="Association Ani’Meaux"
        className="aspect-square w-[150px] justify-self-center md:w-[200px]"
      />

      <Section.TextAside className="max-w-sm justify-self-center md:max-w-none md:justify-self-stretch">
        <div className="grid grid-flow-col justify-start gap-1">
          <SocialLink to={facebookUrl}>
            <Pictogram id="facebook" className="text-[24px]" />
          </SocialLink>

          <SocialLink to={instagramUrl}>
            <Pictogram id="instagram" className="text-[24px]" />
          </SocialLink>
        </div>

        <ul className="grid grid-cols-1">
          <ContactItem icon="phone-solid" to="tel:+33612194392">
            06 12 19 43 92
          </ContactItem>

          <ContactItem icon="envelope-solid" to="mailto:salon@animeaux.org">
            salon@animeaux.org
          </ContactItem>

          <ContactItem icon="image-solid" to={Routes.previousEditions()}>
            Éditions précédentes
          </ContactItem>
        </ul>

        <p>
          Le Salon des Ani’Meaux est organisé par l'association{" "}
          <ProseInlineAction asChild>
            <Link to={animeauxUrl}>Ani’Meaux</Link>
          </ProseInlineAction>
          .
        </p>
      </Section.TextAside>
    </section>
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
        className="grid grid-cols-[auto_auto] items-start gap-1 rounded-0.5 transition-[color,transform] duration-100 ease-in-out active:scale-95 focus-visible:focus-spaced-mystic hover:text-mystic"
      >
        <span className="flex h-2 items-center">
          <Icon id={icon} className="text-[16px]" />
        </span>

        <span>{children}</span>
      </Link>
    </li>
  );
}

function LegalSection() {
  return (
    <section className="relative z-10 grid grid-cols-1 px-page-narrow py-2 md:px-page-normal">
      <LegalBackground className="absolute left-0 top-0 -z-10 h-full w-full" />

      <p className="text-center text-white text-caption-lowercase-emphasis">
        Copyright © {new Date().getFullYear()} Ani’Meaux
      </p>
    </section>
  );
}
