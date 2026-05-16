import { cn } from "@animeaux/core"
import { Link } from "@remix-run/react"

import { Action } from "#i/core/actions/action.js"
import { DynamicImage } from "#i/core/data-display/image.js"
import { LazyElement } from "#i/core/layout/lazy-element.js"
import { Section } from "#i/core/layout/section.js"

export function SectionCarpool() {
  return (
    <Section.Root>
      <LazyElement asChild>
        <Section.ImageAside
          className={cn(
            "aspect-4/3",
            "animation-duration-very-slow out-opacity-0 out-translate-y-4 data-visible:animate-enter data-hidden:opacity-0",
          )}
        >
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
        <Section.TextAside className="animation-duration-very-slow out-opacity-0 out-translate-y-4 data-visible:animate-enter data-hidden:opacity-0">
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
  )
}
