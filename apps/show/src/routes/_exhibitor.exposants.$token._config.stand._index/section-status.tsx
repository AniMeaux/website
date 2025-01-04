import { ProseInlineAction } from "#core/actions/prose-inline-action";
import { Markdown, SENTENCE_COMPONENTS } from "#core/data-display/markdown";
import { HelperCard } from "#core/layout/helper-card";
import { ShowExhibitorStandConfigurationStatus } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionStatus() {
  const { standConfiguration } = useLoaderData<typeof loader>();

  switch (standConfiguration.status) {
    case ShowExhibitorStandConfigurationStatus.AWAITING_VALIDATION: {
      return (
        <HelperCard.Root color="paleBlue">
          <HelperCard.Title>En cours de traitement</HelperCard.Title>

          <p>
            La configuration de votre stand est en cours de validation par notre
            équipe. Pour toute question, vous pouvez nous contacter par e-mail à{" "}
            <ProseInlineAction asChild>
              <a href="mailto:salon@animeaux.org">salon@animeaux.org</a>
            </ProseInlineAction>
            .
          </p>
        </HelperCard.Root>
      );
    }

    case ShowExhibitorStandConfigurationStatus.TO_BE_FILLED: {
      return null;
    }

    case ShowExhibitorStandConfigurationStatus.TO_MODIFY: {
      return (
        <HelperCard.Root color="paleBlue">
          <HelperCard.Title>À modifier</HelperCard.Title>

          <p>
            {standConfiguration.statusMessage == null ? (
              <>
                La configuration de votre stand nécessite quelques
                modifications. Nous vous invitons à les apporter rapidement et à
                nous contacter par e-mail à{" "}
                <ProseInlineAction asChild>
                  <a href="mailto:salon@animeaux.org">salon@animeaux.org</a>
                </ProseInlineAction>{" "}
                pour toute question.
              </>
            ) : (
              <Markdown
                content={standConfiguration.statusMessage}
                components={SENTENCE_COMPONENTS}
              />
            )}
          </p>
        </HelperCard.Root>
      );
    }

    case ShowExhibitorStandConfigurationStatus.VALIDATED: {
      return (
        <HelperCard.Root color="paleBlue">
          <HelperCard.Title>Validée</HelperCard.Title>

          <p>
            La configuration de votre stand est validée et aucune modification
            n’est plus possible. Pour toute question ou besoin particulier,
            merci de nous contacter par e-mail à{" "}
            <ProseInlineAction asChild>
              <a href="mailto:salon@animeaux.org">salon@animeaux.org</a>
            </ProseInlineAction>
            .
          </p>
        </HelperCard.Root>
      );
    }

    default: {
      return standConfiguration.status satisfies never;
    }
  }
}
