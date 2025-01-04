import { ProseInlineAction } from "#core/actions/prose-inline-action";
import { LazyElement } from "#core/layout/lazy-element";
import { LightBoardCard } from "#core/layout/light-board-card";
import { Section } from "#core/layout/section";

export function SectionMoreQuestions() {
  return (
    <Section.Root columnCount={1}>
      <LazyElement asChild>
        <Section.TextAside asChild>
          <LightBoardCard className="translate-y-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-y-0 data-visible:opacity-100">
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
  );
}
