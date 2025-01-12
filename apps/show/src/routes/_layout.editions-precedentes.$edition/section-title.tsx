import { DynamicImage } from "#core/data-display/image";
import { LazyElement } from "#core/layout/lazy-element";
import { Section } from "#core/layout/section";

export function SectionTitle() {
  return (
    <Section.Root>
      <LazyElement asChild>
        <Section.ImageAside className="aspect-square -translate-x-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-x-0 data-visible:opacity-100">
          <DynamicImage
            image={{
              id: "/show/pages/pott-et-pollen-photos-ajfy5llvexzgl0df2rsy",
            }}
            fallbackSize="1024"
            sizes={{ default: "100vw", md: "50vw", lg: "512px" }}
            loading="eager"
            alt="Pott regarde un album photo."
            aspectRatio="none"
            className="absolute inset-x-0 top-1/2 w-full -translate-y-[52%] md:-translate-y-[48%]"
          />
        </Section.ImageAside>
      </LazyElement>

      <LazyElement asChild>
        <Section.TextAside className="translate-x-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-x-0 data-visible:opacity-100">
          <Section.Title asChild>
            <h1>Éditions précédentes</h1>
          </Section.Title>

          <p>
            Revivez les moments forts des éditions précédentes de notre salon en
            parcourant notre galerie de photos.
          </p>
        </Section.TextAside>
      </LazyElement>
    </Section.Root>
  );
}
