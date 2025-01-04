import { ProseInlineAction } from "#core/actions/prose-inline-action";
import { FormLayout } from "#core/layout/form-layout";
import { HelperCard } from "#core/layout/helper-card";
import { LightBoardCard } from "#core/layout/light-board-card";
import {
  PARTNERSHIP_CATEGORY_TRANSLATION,
  PartnershipCategoryDescription,
} from "#exhibitors/partnership/category";
import { ShowExhibitorApplicationOtherPartnershipCategory } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionPartnership() {
  return (
    <FormLayout.Section>
      <FormLayout.Title>Partenariat</FormLayout.Title>

      <StatusHelper />
    </FormLayout.Section>
  );
}

function StatusHelper() {
  const { exhibitor, application } = useLoaderData<typeof loader>();

  if (exhibitor.partnership != null) {
    return (
      <HelperCard.Root color="alabaster">
        <HelperCard.Title>
          {PARTNERSHIP_CATEGORY_TRANSLATION[exhibitor.partnership.category]}
        </HelperCard.Title>

        <p>
          Merci pour votre engagement !
          <br />
          Votre partenariat est essentiel pour sensibiliser et rassembler autour
          de la cause animale.
        </p>

        <PartnershipCategoryDescription
          category={exhibitor.partnership.category}
        />
      </HelperCard.Root>
    );
  }

  if (
    application.otherPartnershipCategory ===
    ShowExhibitorApplicationOtherPartnershipCategory.MAYBE
  ) {
    return (
      <HelperCard.Root color="paleBlue">
        <HelperCard.Title>
          Avez-vous étudié un peu plus la question ?
        </HelperCard.Title>

        <p>
          Nous serions ravis de vous compter parmi nos partenaires et de vous
          offrir une visibilité renforcée tout au long de l’événement !
        </p>

        <p>
          Si vous avez pris votre décision ou souhaitez obtenir plus
          d’informations sur les possibilités de partenariat, n’hésitez pas à
          nous contacter par e-mail à{" "}
          <ProseInlineAction asChild>
            <a href="mailto:salon@animeaux.org">salon@animeaux.org</a>
          </ProseInlineAction>
          .
        </p>
      </HelperCard.Root>
    );
  }

  return (
    <LightBoardCard isSmall>
      <p>
        Vous n’êtes actuellement pas partenaire. Si vous souhaitez le devenir,
        n’hésitez pas à nous contacter par e-mail à{" "}
        <ProseInlineAction asChild>
          <a href="mailto:salon@animeaux.org">salon@animeaux.org</a>
        </ProseInlineAction>
        .
      </p>
    </LightBoardCard>
  );
}
