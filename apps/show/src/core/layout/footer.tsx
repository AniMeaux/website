import { ProseInlineAction } from "#core/actions/actions";
import { SocialLink } from "#core/actions/social-link";
import { FooterWave } from "#core/layout/footer-wave";
import { LegalBackground } from "#core/layout/legal-background";
import { Section } from "#core/layout/section";
import { Routes } from "#core/navigation";
import { Icon } from "#generated/icon";
import { Pictogram } from "#generated/pictogram";
import logoAniMeaux from "#images/logo-ani-meaux.svg";
import { Link } from "@remix-run/react";

export function Footer() {
  return (
    <footer className="grid grid-cols-1">
      <WaitingWaveSection />
      <WaitingLinksSection />
      <LegalSection />
    </footer>
  );
}

function WaitingWaveSection() {
  return (
    <section className="grid grid-cols-1 pt-4">
      <FooterWave className="h-[53px] w-full md:h-[90px]" />
    </section>
  );
}

function WaitingLinksSection() {
  return (
    <section className="grid grid-cols-1 gap-4 bg-paleBlue px-page-narrow py-4 md:grid-cols-2 md:items-center md:px-page-normal lg:gap-8">
      <img
        src={logoAniMeaux}
        alt="Association Ani’Meaux"
        className="aspect-square w-[150px] justify-self-center md:w-[200px]"
      />

      <Section.TextAside className="max-w-sm justify-self-center md:max-w-none md:justify-self-stretch">
        <div className="grid grid-flow-col justify-start gap-1">
          <SocialLink to={CLIENT_ENV.FACEBOOK_URL}>
            <Pictogram id="facebook" className="text-[24px]" />
          </SocialLink>

          <SocialLink to={CLIENT_ENV.INSTAGRAM_URL}>
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
            <Link to={CLIENT_ENV.ANIMEAUX_URL}>Ani’Meaux</Link>
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
