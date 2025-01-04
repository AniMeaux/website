import { ProseInlineAction } from "#core/actions/prose-inline-action";
import { SocialLink } from "#core/actions/social-link";
import { FooterWave } from "#core/layout/footer-wave";
import { LegalBackground } from "#core/layout/legal-background";
import { Section } from "#core/layout/section";
import { Routes } from "#core/navigation";
import { Icon } from "#generated/icon";
import { Pictogram } from "#generated/pictogram";
import logoAniMeaux from "#images/logo-ani-meaux.svg";
import { cn } from "@animeaux/core";
import { Link } from "@remix-run/react";

export const Footer = {
  Root: function FooterRoot({ children }: React.PropsWithChildren<{}>) {
    return <footer className="grid grid-cols-1">{children}</footer>;
  },

  WaveSection: function FooterWaveSection() {
    return (
      <section className="grid grid-cols-1 pt-4">
        <FooterWave className="h-[53px] w-full md:h-[90px]" />
      </section>
    );
  },

  LegalSection: function FooterLegalSection() {
    return (
      <section className="relative z-just-above grid grid-cols-1 px-page-narrow py-2 md:px-page-normal">
        <LegalBackground className="absolute left-0 top-0 -z-just-above h-full w-full" />

        <p className="text-center text-white text-caption-lowercase-emphasis">
          Copyright © {new Date().getFullYear()} Ani’Meaux
        </p>
      </section>
    );
  },

  ContentSection: function FooterContentSection({
    className,
    ...props
  }: React.ComponentPropsWithoutRef<"section">) {
    return (
      <section
        {...props}
        className={cn(
          "bg-paleBlue px-page-narrow py-4 md:px-page-normal",
          className,
        )}
      />
    );
  },

  AnimeauxLogo: function FooterAnimeauxLogo() {
    return (
      <img
        src={logoAniMeaux}
        alt="Association Ani’Meaux"
        className="aspect-square w-[150px] justify-self-center md:w-[200px]"
      />
    );
  },

  Links: function FooterLinks() {
    return (
      <Section.TextAside className="max-w-sm justify-self-center md:max-w-none md:justify-self-stretch">
        <div className="grid grid-flow-col justify-start gap-1">
          <SocialLink to={CLIENT_ENV.FACEBOOK_URL}>
            <Pictogram id="facebook" className="icon-24" />
          </SocialLink>

          <SocialLink to={CLIENT_ENV.INSTAGRAM_URL}>
            <Pictogram id="instagram" className="icon-24" />
          </SocialLink>
        </div>

        <ul className="grid grid-cols-1">
          <ContactItem icon="phone-solid" to="tel:+33612194392">
            06 12 19 43 92
          </ContactItem>

          <ContactItem icon="envelope-solid" to="mailto:salon@animeaux.org">
            salon@animeaux.org
          </ContactItem>

          {CLIENT_ENV.PRESS_RELEASE_URL != null ? (
            <ContactItem
              icon="newspaper-solid"
              to={CLIENT_ENV.PRESS_RELEASE_URL}
            >
              Communiqué de presse
            </ContactItem>
          ) : null}

          <ContactItem
            icon="image-solid"
            to={Routes.previousEditions.toString()}
          >
            Éditions précédentes
          </ContactItem>
        </ul>

        <p>
          Le Salon des Ani’Meaux est organisé par l'association{" "}
          <ProseInlineAction asChild>
            <Link to={CLIENT_ENV.ANIMEAUX_URL}>Ani’Meaux</Link>
          </ProseInlineAction>{" "}
          au Colisée de Meaux, les 7 et 8 juin 2025 de 10h à 18h.
        </p>
      </Section.TextAside>
    );
  },
};

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
        className="grid grid-cols-2-auto items-start gap-1 rounded-0.5 transition-opacity duration-normal active:opacity-80 can-hover:hover:opacity-90 can-hover:focus-visible:focus-spaced active:can-hover:hover:opacity-80"
      >
        <span className="flex h-2 items-center">
          <Icon id={icon} className="icon-16" />
        </span>

        <span>{children}</span>
      </Link>
    </li>
  );
}
