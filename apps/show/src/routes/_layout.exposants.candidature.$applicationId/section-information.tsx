import { ProseInlineAction } from "#i/core/actions/prose-inline-action";
import { BoardCard } from "#i/core/layout/board-card";
import { Section } from "#i/core/layout/section";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import type { loader } from "./loader.server";

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
            Un e-mail de confirmation vous a été envoyé à{" "}
            <strong className="text-body-lowercase-emphasis">
              {application.contactEmail}
            </strong>
            .
            <br />
            <br />
            Votre candidature est actuellement en cours d’étude par nos équipes
            de bénévoles. Les validations commenceront à partir du{" "}
            <strong className="text-body-lowercase-emphasis">
              {DateTime.fromISO(
                CLIENT_ENV.APPLICATION_VALIDATION_START_DATE,
              ).toLocaleString({ month: "long", day: "numeric" })}
            </strong>
            . Après validation, un second formulaire vous permettra de préciser
            vos besoins logistiques (électricité, matériel, etc.) et de procéder
            au paiement de votre stand et options.
            <br />
            <br />
            Vous serez informé(e) par e-mail dès qu’une mise à jour concernant
            votre candidature sera disponible.
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
