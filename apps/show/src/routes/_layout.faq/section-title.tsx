import { DynamicImage } from "#i/core/data-display/image";
import { LazyElement } from "#i/core/layout/lazy-element";
import { Section } from "#i/core/layout/section";

export function SectionTitle() {
  return (
    <Section.Root>
      <LazyElement asChild>
        <Section.ImageAside className="aspect-square -translate-x-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-x-0 data-visible:opacity-100">
          <DynamicImage
            image={{ id: "/show/pages/pott-et-pollen-faq_yj87jv" }}
            fallbackSize="1024"
            sizes={{ default: "100vw", md: "50vw", lg: "512px" }}
            loading="eager"
            alt="Pott et Pollen se posent des questions."
            aspectRatio="none"
            className="absolute inset-x-0 top-1/2 w-full -translate-y-[55%] md:-translate-y-[52%]"
          />
        </Section.ImageAside>
      </LazyElement>

      <LazyElement asChild>
        <Section.TextAside className="translate-x-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-x-0 data-visible:opacity-100">
          <Section.Title>Foire aux questions</Section.Title>

          <p>Retrouvez ici les réponses aux questions fréquemment posées.</p>
        </Section.TextAside>
      </LazyElement>
    </Section.Root>
  );
}
