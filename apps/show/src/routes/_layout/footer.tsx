import { Action } from "#core/actions/action";
import { DynamicImage } from "#core/data-display/image";
import { hasShowEnded } from "#core/dates";
import { Footer } from "#core/layout/footer";
import { LazyElement } from "#core/layout/lazy-element";
import { Section } from "#core/layout/section";
import { PartnerItem } from "#partners/item";
import { PartnersPlaceholderImage } from "#partners/placeholder-image";
import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function LayoutFooter() {
  if (CLIENT_ENV.FEATURE_FLAG_SITE_ONLINE === "true") {
    return <FooterOnline />;
  }

  return <FooterWaiting />;
}

function FooterOnline() {
  const { partners } = useLoaderData<typeof loader>();

  return (
    <Footer.Root>
      <Footer.WaveSection className="grid-cols-1 gap-2 md:grid-cols-2 md:items-end md:gap-4 lg:gap-8">
        <Section.TextAside className="rounded-2 bg-alabaster p-2">
          <Section.Title>Économisez, soutenez, profitez !</Section.Title>

          <p>
            En achetant vos billets à l’avance, vous bénéficiez d’un tarif
            avantageux, vous évitez les files d’attente aux guichets à votre
            arrivée et vous apportez votre soutien à l’association organisatrice
            du salon !
          </p>

          {!hasShowEnded() ? (
            <Section.Action asChild>
              <Action color="mystic" asChild>
                <Link to={CLIENT_ENV.TICKETING_URL}>Achetez votre billet</Link>
              </Action>
            </Section.Action>
          ) : null}
        </Section.TextAside>

        <LazyElement asChild>
          <Section.ImageAside className="-z-just-above aspect-4/3 translate-y-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-y-0 data-visible:opacity-100">
            <DynamicImage
              image={{ id: "/show/pages/pott-tirelire-tfktgcbzu4pozfvtgb0u" }}
              alt="Pott tient une tirelire"
              fallbackSize="512"
              sizes={{ default: "384px", md: "50vw", lg: "464px" }}
              aspectRatio="none"
              objectFit="contain"
              className="absolute inset-x-0 top-0 h-[103%] w-full"
            />
          </Section.ImageAside>
        </LazyElement>
      </Footer.WaveSection>

      <Footer.ContentSection className="grid grid-cols-1 gap-4 md:grid-cols-fr-auto-fr md:items-center lg:gap-8">
        <Section.TextAside className="max-w-sm justify-self-center md:max-w-none md:justify-self-stretch">
          {partners.length === 0 ? (
            <PartnersPlaceholderImage
              sizes={{ default: "384px", md: "50vw", lg: "341px" }}
              fallbackSize="512"
              className="w-full"
            />
          ) : (
            <ul className="flex flex-wrap justify-center gap-1">
              {partners.map((partner) => (
                <PartnerItem
                  key={partner.id}
                  isSmall
                  partner={partner}
                  imageFallbackSize="128"
                  imageSizes={{ default: "70px" }}
                  className="w-[70px] flex-none"
                />
              ))}
            </ul>
          )}
        </Section.TextAside>

        <Footer.AnimeauxLogo />

        <Footer.Links />
      </Footer.ContentSection>

      <Footer.LegalSection />
    </Footer.Root>
  );
}

function FooterWaiting() {
  return (
    <Footer.Root>
      <Footer.WaveSection />

      <Footer.ContentSection className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center lg:gap-8">
        <Footer.AnimeauxLogo isLarge />
        <Footer.Links />
      </Footer.ContentSection>

      <Footer.LegalSection />
    </Footer.Root>
  );
}
