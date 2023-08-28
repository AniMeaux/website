import { createConfig } from "#core/config.server.ts";
import { useConfig } from "#core/config.ts";
import { ErrorPage, getErrorTitle } from "#core/dataDisplay/errorPage.tsx";
import { ShowDay } from "#core/dates.ts";
import { BoardCard } from "#core/layout/boardCard.tsx";
import { Section } from "#core/layout/section.tsx";
import { createSocialMeta } from "#core/meta.ts";
import { Routes } from "#core/navigation.tsx";
import { getPageTitle } from "#core/pageTitle.ts";
import { NotFoundResponse } from "#core/response.server.ts";
import { json, redirect } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";

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

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
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
            <h2 className="text-title-item text-mystic">
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
