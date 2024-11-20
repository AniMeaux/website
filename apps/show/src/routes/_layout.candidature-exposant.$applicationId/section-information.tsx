import { ProseInlineAction } from "#core/actions/prose-inline-action";
import { BoardCard } from "#core/layout/board-card";
import { Section } from "#core/layout/section";
import { Link, useLoaderData } from "@remix-run/react";
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
            Un email de confirmation vous a été envoyé à{" "}
            <strong className="text-body-lowercase-emphasis">
              {application.contactEmail}
            </strong>
            .
            <br />
            <br />
            Votre dossier en cours de validation et vous recevrez par email
            toute évolution de votre demande.
            <br />
            <br />
            Pour tout complément d’informations, vous pouvez nous contacter via{" "}
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
            </ProseInlineAction>
            .
          </p>
        </BoardCard>
      </Section.TextAside>
    </Section.Root>
  );
}
