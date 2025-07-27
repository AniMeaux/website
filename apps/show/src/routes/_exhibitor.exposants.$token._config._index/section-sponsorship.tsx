import { ProseInlineAction } from "#core/actions/prose-inline-action";
import { FormLayout } from "#core/layout/form-layout";
import { HelperCard } from "#core/layout/helper-card";
import { LightBoardCard } from "#core/layout/light-board-card";
import {
  SPONSORSHIP_CATEGORY_TRANSLATION,
  SponsorshipCategoryDescription,
} from "#exhibitors/sponsorship/category";
import { ShowExhibitorApplicationOtherSponsorshipCategory } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionSponsorship() {
  return (
    <FormLayout.Section>
      <FormLayout.Title>Sponsor</FormLayout.Title>

      <StatusHelper />
    </FormLayout.Section>
  );
}

function StatusHelper() {
  const { exhibitor, application } = useLoaderData<typeof loader>();

  if (exhibitor.sponsorship != null) {
    return (
      <HelperCard.Root color="alabaster">
        <HelperCard.Title>
          {SPONSORSHIP_CATEGORY_TRANSLATION[exhibitor.sponsorship.category]}
        </HelperCard.Title>

        <p>
          Merci pour votre engagement !
          <br />
          Votre soutien est essentiel pour sensibiliser et rassembler autour de
          la cause animale.
        </p>

        <SponsorshipCategoryDescription
          category={exhibitor.sponsorship.category}
        />
      </HelperCard.Root>
    );
  }

  if (
    application.otherSponsorshipCategory ===
    ShowExhibitorApplicationOtherSponsorshipCategory.MAYBE
  ) {
    return (
      <HelperCard.Root color="paleBlue">
        <HelperCard.Title>
          Avez-vous étudié un peu plus la question ?
        </HelperCard.Title>

        <p>
          Nous serions ravis de vous compter parmi nos sponsors et de vous
          offrir une visibilité renforcée tout au long de l’événement !
        </p>

        <p>
          Si vous avez pris votre décision ou souhaitez obtenir plus
          d’informations sur les possibilités de sponsor, n’hésitez pas à nous
          contacter par e-mail à{" "}
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
        Vous n’êtes actuellement pas sponsor. Si vous souhaitez le devenir,
        n’hésitez pas à nous contacter par e-mail à{" "}
        <ProseInlineAction asChild>
          <a href="mailto:salon@animeaux.org">salon@animeaux.org</a>
        </ProseInlineAction>
        .
      </p>
    </LightBoardCard>
  );
}
