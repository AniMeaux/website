import { json } from "@remix-run/node";
import { Link, V2_MetaFunction } from "@remix-run/react";
import { Action } from "~/core/actions";
import { useConfig } from "~/core/config";
import { createConfig } from "~/core/config.server";
import { ErrorPage, getErrorTitle } from "~/core/dataDisplay/errorPage";
import { BoardCard } from "~/core/layout/boardCard";
import { Section } from "~/core/layout/section";
import { createSocialMeta } from "~/core/meta";
import { getPageTitle } from "~/core/pageTitle";
import { NotFoundResponse } from "~/core/response.server";

export async function loader() {
  const { featureFlagSiteOnline } = createConfig();

  if (!featureFlagSiteOnline) {
    throw new NotFoundResponse();
  }

  return json("ok" as const);
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(data === "ok" ? "Exposants" : getErrorTitle(404)),
  });
};

export function ErrorBoundary() {
  const { featureFlagSiteOnline } = useConfig();

  return <ErrorPage isStandAlone={!featureFlagSiteOnline} />;
}

export default function Route() {
  const { exhibitorsFormUrl } = useConfig();

  return (
    <>
      <Section columnCount={1}>
        <Section.Title asChild>
          <h1>Exposants</h1>
        </Section.Title>
      </Section>

      <Section columnCount={1}>
        <Section.TextAside asChild>
          <BoardCard>
            <h2 className="text-title-item text-mystic">
              Il est encore un peu tôt
            </h2>

            <p>
              Nous sommes actuellement en pleine phase de sélection des
              exposants qui participeront à l’édition prochaine du salon. Nous
              mettons tout en œuvre pour choisir les meilleurs candidats afin de
              proposer une expérience exceptionnelle aux visiteurs.
              <br />
              <br />
              La liste des exposants retenus sera{" "}
              <strong className="text-body-lowercase-emphasis">
                communiquée ultérieurement
              </strong>
              , restez donc à l’affût pour découvrir les acteurs passionnants
              qui feront partie de cet événement inoubliable !
            </p>

            <Section.Action asChild>
              <Action asChild>
                <Link to={exhibitorsFormUrl}>Devenez exposant</Link>
              </Action>
            </Section.Action>
          </BoardCard>
        </Section.TextAside>
      </Section>
    </>
  );
}
