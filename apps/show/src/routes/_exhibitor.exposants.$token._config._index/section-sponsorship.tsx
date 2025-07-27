import { ProseInlineAction } from "#core/actions/prose-inline-action";
import { FormLayout } from "#core/layout/form-layout";
import { HelperCard } from "#core/layout/helper-card";
import { LightBoardCard } from "#core/layout/light-board-card";
import { SponsorshipCategory } from "#exhibitors/sponsorship/category";
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
  const { exhibitor } = useLoaderData<typeof loader>();

  if (exhibitor.sponsorship != null) {
    return (
      <HelperCard.Root color="alabaster">
        <HelperCard.Title>
          {SponsorshipCategory.translation[exhibitor.sponsorship.category]}
        </HelperCard.Title>

        <p>
          Merci pour votre engagement !
          <br />
          Votre soutien est essentiel pour sensibiliser et rassembler autour de
          la cause animale.
          {CLIENT_ENV.SPONSORSHIP_URL != null ? (
            <>
              {" "}
              Consultez{" "}
              <ProseInlineAction asChild>
                <a href={CLIENT_ENV.SPONSORSHIP_URL}>notre document</a>
              </ProseInlineAction>{" "}
              détaillant toutes les informations nécessaires.
            </>
          ) : null}
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
