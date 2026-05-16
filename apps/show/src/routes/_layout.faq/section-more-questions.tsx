import { ProseInlineAction } from "#i/core/actions/prose-inline-action.js"
import { LazyElement } from "#i/core/layout/lazy-element.js"
import { LightBoardCard } from "#i/core/layout/light-board-card.js"
import { Section } from "#i/core/layout/section.js"

export function SectionMoreQuestions() {
  return (
    <Section.Root columnCount={1}>
      <LazyElement asChild>
        <Section.TextAside asChild>
          <LightBoardCard className="animation-duration-very-slow out-opacity-0 out-translate-y-4 data-visible:animate-enter data-hidden:opacity-0">
            <Section.Title>Vous avez une autre question ?</Section.Title>

            <p>
              Contactez-nous par e-mail à{" "}
              <ProseInlineAction asChild>
                <a href="mailto:salon@animeaux.org">salon@animeaux.org</a>
              </ProseInlineAction>{" "}
              et nous vous répondrons dans les plus brefs délais !
            </p>
          </LightBoardCard>
        </Section.TextAside>
      </LazyElement>
    </Section.Root>
  )
}
