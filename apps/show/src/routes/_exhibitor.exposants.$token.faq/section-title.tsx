import { DynamicImage } from "#core/data-display/image";
import { LazyElement } from "#core/layout/lazy-element";
import { Section } from "#core/layout/section";

export function SectionTitle() {
  return (
    <Section.Root>
      <LazyElement asChild>
        <Section.ImageAside className="aspect-square translate-y-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-y-0 data-visible:opacity-100">
          <DynamicImage
            image={{
              id: "/show/pages/pott-et-pollen-faq-vozbjrvath4s7gt8vhpa",
            }}
            fallbackSize="1024"
            sizes={{ default: "100vw", md: "50vw", lg: "512px" }}
            loading="eager"
            alt="Pott et Pollen se posent des questions."
            aspectRatio="1:1"
            className="w-full"
          />
        </Section.ImageAside>
      </LazyElement>

      <LazyElement asChild>
        <Section.TextAside className="translate-y-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-y-0 data-visible:opacity-100 md:col-start-1 md:row-start-1">
          <Section.Title>Foire aux questions</Section.Title>

          <p>Retrouvez ici les réponses aux questions fréquemment posées.</p>
        </Section.TextAside>
      </LazyElement>
    </Section.Root>
  );
}
