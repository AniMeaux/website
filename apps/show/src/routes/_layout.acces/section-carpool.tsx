import { Action } from "#i/core/actions/action";
import { DynamicImage } from "#i/core/data-display/image";
import { LazyElement } from "#i/core/layout/lazy-element";
import { Section } from "#i/core/layout/section";
import { Link } from "@remix-run/react";

export function SectionCarpool() {
  return (
    <Section.Root>
      <LazyElement asChild>
        <Section.ImageAside className="aspect-4/3 translate-y-4 items-center opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-y-0 data-visible:opacity-100">
          <DynamicImage
            image={{
              id: "/show/pages/pott-et-pollen-covoiturage-dnaoqhszblkdcwsi9ryx",
            }}
            fallbackSize="1024"
            sizes={{ default: "384px", md: "50vw", lg: "512px" }}
            alt="Pott et Pollen font du covoiturage."
            aspectRatio="none"
            className="w-full"
          />
        </Section.ImageAside>
      </LazyElement>

      <LazyElement asChild>
        <Section.TextAside className="translate-y-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-y-0 data-visible:opacity-100 md:col-start-1 md:row-start-1">
          <Section.Title>Covoiturage</Section.Title>

          <p>
            Proposez ou demandez un covoiturage, sur le groupe Facebook dédié,
            pour vous rendre au Salon des Ani’Meaux.
          </p>

          <Section.Action asChild>
            <Action color="mystic" asChild>
              <Link to={CLIENT_ENV.CARPOOL_FACEBOOK_GROUP_URL}>
                Rejoindre le groupe
              </Link>
            </Action>
          </Section.Action>
        </Section.TextAside>
      </LazyElement>
    </Section.Root>
  );
}
