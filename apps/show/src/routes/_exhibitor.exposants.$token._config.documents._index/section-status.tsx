import { ProseInlineAction } from "#core/actions/prose-inline-action";
import { Markdown, SENTENCE_COMPONENTS } from "#core/data-display/markdown";
import { HelperCard } from "#core/layout/helper-card";
import { ShowExhibitorDocumentsStatus } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionStatus() {
  const { documents } = useLoaderData<typeof loader>();

  switch (documents.status) {
    case ShowExhibitorDocumentsStatus.AWAITING_VALIDATION: {
      return (
        <HelperCard.Root color="paleBlue">
          <HelperCard.Title>En cours de traitement</HelperCard.Title>

          <p>
            Votre dossier est en cours de validation par notre équipe. Pour
            toute question, vous pouvez nous contacter par e-mail à{" "}
            <ProseInlineAction asChild>
              <a href="mailto:salon@animeaux.org">salon@animeaux.org</a>
            </ProseInlineAction>
            .
          </p>
        </HelperCard.Root>
      );
    }

    case ShowExhibitorDocumentsStatus.TO_BE_FILLED: {
      return null;
    }

    case ShowExhibitorDocumentsStatus.TO_MODIFY: {
      return (
        <HelperCard.Root color="paleBlue">
          <HelperCard.Title>À modifier</HelperCard.Title>

          <p>
            {documents.statusMessage == null ? (
              <>
                Votre dossier nécessite quelques modifications. Nous vous
                invitons à les apporter rapidement et à nous contacter par
                e-mail à{" "}
                <ProseInlineAction asChild>
                  <a href="mailto:salon@animeaux.org">salon@animeaux.org</a>
                </ProseInlineAction>{" "}
                pour toute question.
              </>
            ) : (
              <Markdown
                content={documents.statusMessage}
                components={SENTENCE_COMPONENTS}
              />
            )}
          </p>
        </HelperCard.Root>
      );
    }

    case ShowExhibitorDocumentsStatus.VALIDATED: {
      return (
        <HelperCard.Root color="paleBlue">
          <HelperCard.Title>Validée</HelperCard.Title>

          <p>
            Votre dossier est complété et validé par notre équipe. Pour toute
            demande de modification, merci de nous contacter par e-mail à{" "}
            <ProseInlineAction asChild>
              <a href="mailto:salon@animeaux.org">salon@animeaux.org</a>
            </ProseInlineAction>
            .
          </p>
        </HelperCard.Root>
      );
    }

    default: {
      return documents.status satisfies never;
    }
  }
}
