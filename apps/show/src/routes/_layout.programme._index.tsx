import { useConfig } from "#core/config";
import { createConfig } from "#core/config.server";
import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { ShowDay } from "#core/dates";
import { BoardCard } from "#core/layout/board-card";
import { Section } from "#core/layout/section";
import { createSocialMeta } from "#core/meta";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { NotFoundResponse } from "#core/response.server";
import type { MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

export async function loader() {
  const { featureFlagShowProgram, featureFlagSiteOnline } = createConfig();

  if (!featureFlagSiteOnline) {
    throw new NotFoundResponse();
  }

  if (!featureFlagShowProgram) {
    return json("ok" as const);
  }

  throw redirect(Routes.program(ShowDay.SATURDAY));
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(data === "ok" ? "Programme" : getErrorTitle(404)),
  });
};

export function ErrorBoundary() {
  const { featureFlagSiteOnline } = useConfig();

  return <ErrorPage isStandAlone={!featureFlagSiteOnline} />;
}

export default function Route() {
  return (
    <>
      <Section columnCount={1}>
        <Section.Title asChild>
          <h1>Programme</h1>
        </Section.Title>
      </Section>

      <Section columnCount={1}>
        <Section.TextAside asChild>
          <BoardCard>
            <h2 className="text-mystic text-title-item">
              En pleine effervescence
            </h2>

            <p>
              Nous sommes en plein préparatif pour vous offrir un programme
              d’animations exceptionnel lors de notre prochain salon. Nos
              équipes travaillent avec passion pour créer des expériences
              captivantes, éducatives et divertissantes qui raviront petits et
              grands amoureux des animaux.
              <br />
              <br />
              Restez connectés, car très bientôt, nous vous dévoilerons en
              exclusivité le programme complet de nos activités. Soyez prêts à
              plonger dans un univers de découvertes et de moments inoubliables
              avec nos amis à quatre pattes !
              <br />
              <br />
              N’hésitez pas à nous solliciter si vous souhaitez proposer une
              animation.
            </p>
          </BoardCard>
        </Section.TextAside>
      </Section>
    </>
  );
}
