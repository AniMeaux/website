import { ProseInlineAction } from "#core/actions/prose-inline-action";
import { LightBoardCard } from "#core/layout/light-board-card";
import { Section } from "#core/layout/section";

export function SectionDescription() {
  return (
    <Section.Root columnCount={1}>
      <Section.TextAside asChild>
        <LightBoardCard>
          <p>
            Ce formulaire nous permet de mieux connaître votre activité afin de
            sélectionner les exposants les plus en phase avec les valeurs du
            salon et les attentes de nos visiteurs. La candidature ne garantit
            pas une place : les organisateurs se réservent le droit de
            sélection.
          </p>

          <p>
            Après validation, un second formulaire vous permettra de préciser
            vos besoins logistiques (électricité, matériel, etc.) et de procéder
            au paiement de votre stand et options.
          </p>

          <p>
            Merci pour votre intérêt ! Pour toute question, contactez-nous à{" "}
            <ProseInlineAction asChild>
              <a href="mailto:salon@animeaux.org">salon@animeaux.org</a>
            </ProseInlineAction>
            .
          </p>
        </LightBoardCard>
      </Section.TextAside>
    </Section.Root>
  );
}
