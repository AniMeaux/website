import { ProseInlineAction } from "#core/actions/prose-inline-action";
import { BoardCard } from "#core/layout/board-card";
import { Section } from "#core/layout/section";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionInformation() {
  const { application } = useLoaderData<typeof loader>();

  return (
    <Section.Root columnCount={1}>
      <Section.TextAside asChild>
        <BoardCard>
          <h2 className="text-mystic text-title-item">
            Votre candidature a bien été envoyée
          </h2>

          <p>
            Votre dossier a bien été reçu et est actuellement en cours d’étude
            par nos équipes de bénévoles.
            <br />
            Un e-mail de confirmation vous a été envoyé à{" "}
            <strong className="text-body-lowercase-emphasis">
              {application.contactEmail}
            </strong>
            .
            <br />
            <br />
            Vous serez informé(e) par e-mail dès qu’une mise à jour concernant
            votre demande sera disponible.
            <br />
            Pour toute question ou complément d’information, n’hésitez pas à
            nous contacter par e-mail à :{" "}
            <ProseInlineAction asChild>
              <a href="mailto:salon@animeaux.org">salon@animeaux.org</a>
            </ProseInlineAction>
            .
          </p>
        </BoardCard>
      </Section.TextAside>
    </Section.Root>
  );
}
