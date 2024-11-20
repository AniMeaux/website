import { ProseInlineAction } from "#core/actions/prose-inline-action";
import { LightBoardCard } from "#core/layout/light-board-card";
import { Section } from "#core/layout/section";
import { Link } from "@remix-run/react";

export function SectionDescription() {
  return (
    <Section.Root columnCount={1}>
      <Section.TextAside asChild>
        <LightBoardCard>
          <p>
            Ce formulaire nous permettra de mieux vous connaître, d’évaluer
            votre activité et de sélectionner les exposants qui s’intégreront au
            mieux à notre événement.
            <br />
            <br />
            Votre candidature ne garantit pas automatiquement une place, mais
            elle nous aidera à faire les meilleurs choix pour offrir une
            expérience enrichissante à nos visiteurs. Les organisateurs du salon
            se réservent le droit de sélectionner les exposants en fonction de
            la pertinence de leurs activités et de l’adéquation avec les valeurs
            du salon.
            <br />
            <br />
            Nous vous remercions par avance pour votre intérêt et votre
            participation. N’hésitez pas à nous contacter via{" "}
            <ProseInlineAction asChild>
              <Link to={CLIENT_ENV.FACEBOOK_URL}>Facebook</Link>
            </ProseInlineAction>
            ,{" "}
            <ProseInlineAction asChild>
              <Link to={CLIENT_ENV.INSTAGRAM_URL}>Instagram</Link>
            </ProseInlineAction>{" "}
            ou par{" "}
            <ProseInlineAction asChild>
              <Link to="mailto:salon@animeaux.org">email</Link>
            </ProseInlineAction>{" "}
            si vous avez des questions supplémentaires.
          </p>
        </LightBoardCard>
      </Section.TextAside>
    </Section.Root>
  );
}
