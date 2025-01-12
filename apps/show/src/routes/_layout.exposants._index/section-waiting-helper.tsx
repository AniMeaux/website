import { Action } from "#core/actions/action";
import { BoardCard } from "#core/layout/board-card";
import { Section } from "#core/layout/section";
import { Routes } from "#core/navigation";
import { Link } from "@remix-run/react";

export function SectionWaitingHelper() {
  return (
    <Section.Root columnCount={1}>
      <Section.TextAside asChild>
        <BoardCard>
          <h2 className="text-mystic text-title-item">
            Il est encore un peu tôt
          </h2>

          <p>
            Nous sommes actuellement en pleine phase de sélection des exposants
            qui participeront à l’édition prochaine du salon. Nous mettons tout
            en œuvre pour choisir les meilleurs candidats afin de proposer une
            expérience exceptionnelle aux visiteurs.
          </p>

          <p>
            La liste des exposants retenus sera{" "}
            <strong className="text-body-lowercase-emphasis">
              communiquée ultérieurement
            </strong>
            , restez donc à l’affût pour découvrir les acteurs passionnants qui
            feront partie de cet événement inoubliable !
          </p>

          {CLIENT_ENV.FEATURE_FLAG_EXHIBITOR_APPLICATION_ONLINE === "true" ? (
            <Section.Action asChild>
              <Action asChild>
                <Link to={Routes.exhibitorApplication.toString()}>
                  Devenez exposant
                </Link>
              </Action>
            </Section.Action>
          ) : null}
        </BoardCard>
      </Section.TextAside>
    </Section.Root>
  );
}
