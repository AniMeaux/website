import { BoardCard } from "#i/core/layout/board-card.js"
import { LazyElement } from "#i/core/layout/lazy-element.js"
import { Section } from "#i/core/layout/section.js"

export function SectionEcology() {
  return (
    <Section.Root id="transports-ecologiques" columnCount={1}>
      <LazyElement asChild>
        <Section.TextAside asChild>
          <BoardCard className="animation-duration-very-slow out-opacity-0 out-translate-y-4 data-visible:animate-enter data-hidden:opacity-0">
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
  )
}
