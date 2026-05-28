import { cn } from "@animeaux/core"

import { DynamicImage } from "#i/core/data-display/image.js"
import { LazyElement } from "#i/core/layout/lazy-element.js"
import { Section } from "#i/core/layout/section.js"

export function SectionTitle() {
  return (
    <Section.Root id="foire-aux-questions">
      <LazyElement asChild>
        <Section.ImageAside
          className={cn(
            "aspect-square",
            "-out-translate-x-4 animation-duration-very-slow out-opacity-0 data-visible:animate-enter data-hidden:opacity-0",
          )}
        >
          <DynamicImage
            image={{ id: "/show/pages/pott-et-pollen-faq_yj87jv" }}
            fallbackSize="1024"
            sizes={{ default: "100vw", md: "50vw", lg: "512px" }}
            loading="eager"
            alt="Pott et Pollen se posent des questions."
            aspectRatio="none"
            className="absolute inset-x-0 top-1/2 w-full translate-y-[-55%] md:translate-y-[-52%]"
          />
        </Section.ImageAside>
      </LazyElement>

      <LazyElement asChild>
        <Section.TextAside className="animation-duration-very-slow out-opacity-0 out-translate-x-4 data-visible:animate-enter data-hidden:opacity-0">
          <Section.Title>Foire aux questions</Section.Title>

          <p>Retrouvez ici les réponses aux questions fréquemment posées.</p>
        </Section.TextAside>
      </LazyElement>
    </Section.Root>
  )
}
