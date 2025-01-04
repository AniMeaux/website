import { ProseInlineAction } from "#core/actions/prose-inline-action";
import { FormLayout } from "#core/layout/form-layout";
import { HelperCard } from "#core/layout/helper-card";
import { LightBoardCard } from "#core/layout/light-board-card";

export function SectionOnStage() {
  return (
    <FormLayout.Section>
      <FormLayout.Title>Animations sur scène</FormLayout.Title>

      <HelperCard.Root color="paleBlue">
        <p>
          Vous avez la possibilité d’organiser une animation sur scène (débat,
          conférence, animation participative, etc…), sous réserve de la
          disponibilité des créneaux. Contactez-nous par e-mail à{" "}
          <ProseInlineAction asChild>
            <a href="mailto:salon@animeaux.org">salon@animeaux.org</a>
          </ProseInlineAction>{" "}
          pour mettre en place une animation !
        </p>
      </HelperCard.Root>

      <LightBoardCard isSmall>
        <p>Aucune animation sur scène prévue.</p>
      </LightBoardCard>
    </FormLayout.Section>
  );
}
