import { BoardCard } from "#i/core/layout/board-card";
import { LazyElement } from "#i/core/layout/lazy-element";
import { Section } from "#i/core/layout/section";

export function SectionEcology() {
  return (
    <Section.Root columnCount={1}>
      <LazyElement asChild>
        <Section.TextAside asChild>
          <BoardCard className="translate-y-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-y-0 data-visible:opacity-100">
            <Section.Title>
              Privilégiez les moyens de transports écologiques
            </Section.Title>

            <p>
              Pensez à la planète et déplacez vous à pied, en vélo ou en
              transports en commun. La salle du Colisée de Meaux est très bien
              desservie par les bus, et proche du parc du pâtis pour une balade
              agréable avant ou après votre visite.
            </p>
          </BoardCard>
        </Section.TextAside>
      </LazyElement>
    </Section.Root>
  );
}
