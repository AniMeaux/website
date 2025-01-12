import { Action } from "#core/actions/action";
import { DynamicImage } from "#core/data-display/image";
import { LazyElement } from "#core/layout/lazy-element";
import { Section } from "#core/layout/section";
import { Link } from "@remix-run/react";

export function SectionTitle() {
  return (
    <Section.Root>
      <LazyElement asChild>
        <Section.ImageAside className="aspect-square -translate-x-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-x-0 data-visible:opacity-100">
          <DynamicImage
            image={{
              id: "/show/pages/pott-plan-jceivcyzibkcg2qtp8jj",
            }}
            fallbackSize="1024"
            sizes={{ default: "100vw", md: "50vw", lg: "512px" }}
            loading="eager"
            alt="Pott regarde un plan."
            aspectRatio="none"
            className="absolute inset-x-0 top-1/2 w-full -translate-y-[56%] md:-translate-y-[53%]"
          />
        </Section.ImageAside>
      </LazyElement>

      <LazyElement asChild>
        <Section.TextAside className="translate-x-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-x-0 data-visible:opacity-100">
          <Section.Title asChild>
            <h1>Accès au salon</h1>
          </Section.Title>

          <p>
            Voiture, bus, vélo ou à pied, tous les moyens sont bons pour visiter
            le Salon des Ani’Meaux !
          </p>

          <Section.Action asChild>
            <Action color="mystic" asChild>
              <Link to="https://goo.gl/maps/bix61Gb2vAUdpgtq5">
                Voir le plan
              </Link>
            </Action>
          </Section.Action>
        </Section.TextAside>
      </LazyElement>
    </Section.Root>
  );
}
