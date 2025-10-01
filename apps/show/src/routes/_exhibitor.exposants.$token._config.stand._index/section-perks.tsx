import { Markdown, PARAGRAPH_COMPONENTS } from "#core/data-display/markdown";
import { FormLayout } from "#core/layout/form-layout";
import { HelperCard } from "#core/layout/helper-card";
import { Routes } from "#core/navigation";
import { PerksHelper } from "#exhibitors/perks/helper.js";
import { Icon } from "#generated/icon";
import { ShowExhibitorStatus } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server.js";

export function SectionPerks() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Section>
      <FormLayout.Header>
        <FormLayout.Title>Avantages</FormLayout.Title>

        {exhibitor.perksStatus !== ShowExhibitorStatus.VALIDATED ? (
          <FormLayout.HeaderAction asChild>
            <Link
              to={Routes.exhibitors
                .token(exhibitor.token)
                .stand.editPerks.toString()}
              title="Modifier"
            >
              <Icon id="pen-light" />
            </Link>
          </FormLayout.HeaderAction>
        ) : null}
      </FormLayout.Header>

      <SectionStatus />

      <PerksHelper />

      <FormLayout.Row>
        <FieldBreakfastPeopleCountSaturday />
        <FieldBreakfastPeopleCountSunday />
      </FormLayout.Row>
    </FormLayout.Section>
  );
}

function FieldBreakfastPeopleCountSaturday() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Field>
      <FormLayout.Label>
        Nombre de personnes pour le petit-déjeuner du samedi
      </FormLayout.Label>

      <FormLayout.Output>
        {exhibitor.breakfastPeopleCountSaturday}
      </FormLayout.Output>
    </FormLayout.Field>
  );
}

function FieldBreakfastPeopleCountSunday() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Field>
      <FormLayout.Label>
        Nombre de personnes pour le petit-déjeuner du dimanche
      </FormLayout.Label>

      <FormLayout.Output>
        {exhibitor.breakfastPeopleCountSunday}
      </FormLayout.Output>
    </FormLayout.Field>
  );
}

function SectionStatus() {
  const { exhibitor } = useLoaderData<typeof loader>();

  if (exhibitor.perksStatus === ShowExhibitorStatus.TO_BE_FILLED) {
    return null;
  }

  const title = (
    {
      [ShowExhibitorStatus.AWAITING_VALIDATION]: "En cours de traitement",
      [ShowExhibitorStatus.TO_MODIFY]: "À modifier",
      [ShowExhibitorStatus.VALIDATED]: "Validée",
    } satisfies Record<typeof exhibitor.perksStatus, string>
  )[exhibitor.perksStatus];

  const content = (
    {
      [ShowExhibitorStatus.AWAITING_VALIDATION]:
        "Les avantages que vous avez sélectionnés sont en cours de traitement par notre équipe. Pour toute question, vous pouvez nous contacter par e-mail à salon@animeaux.org.",
      [ShowExhibitorStatus.TO_MODIFY]:
        exhibitor.perksStatusMessage ??
        "Les avantages que vous avez sélectionnés nécessitent quelques modifications. Nous vous invitons à les apporter rapidement et à nous contacter par e-mail à salon@animeaux.org pour toute question.",
      [ShowExhibitorStatus.VALIDATED]:
        "Les avantages que vous avez sélectionnés sont validés par notre équipe et aucune modification n’est plus possible. Pour toute question ou besoin particulier, merci de nous contacter par e-mail à salon@animeaux.org.",
    } satisfies Record<typeof exhibitor.perksStatus, string>
  )[exhibitor.perksStatus];

  return (
    <HelperCard.Root color="paleBlue">
      <HelperCard.Title>{title}</HelperCard.Title>

      <div>
        <Markdown content={content} components={PARAGRAPH_COMPONENTS} />
      </div>
    </HelperCard.Root>
  );
}
