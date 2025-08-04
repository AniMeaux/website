import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import { services } from "#core/services.server.js";
import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { QUESTIONS } from "./data.server";
import { SectionMoreQuestions } from "./section-more-questions";
import { SectionQuestions } from "./section-questions";
import { SectionSharedFiles } from "./section-shared-files";
import { SectionTitle } from "./section-title";

export async function loader() {
  const files = await services.fileStorage.getFiles(
    process.env.GOOGLE_DRIVE_SHARED_FOLDER_ID,
  );

  return json({ questions: QUESTIONS, files });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null ? "Foire aux questions" : getErrorTitle(404),
    ),
  });
};

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  return (
    <>
      <SectionTitle />
      <SectionQuestions />
      <SectionSharedFiles />
      <SectionMoreQuestions />
    </>
  );
}
