import { getErrorTitle } from "#i/core/data-display/error-page.js";
import { FormLayout } from "#i/core/layout/form-layout.js";
import { createSocialMeta } from "#i/core/meta.js";
import { getPageTitle } from "#i/core/page-title.js";
import type { MetaFunction } from "@remix-run/react";
import type { loader } from "./loader.server";
import { SectionForm } from "./section-form";
import { SectionHelper } from "./section-helper";

export { action } from "./action.server";
export { loader } from "./loader.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null
        ? ["Modifier l’adresse de facturation", data.exhibitor.name]
        : getErrorTitle(404),
    ),
  });
};

export default function Route() {
  return (
    <FormLayout.Root className="py-4 px-safe-page-narrow md:px-safe-page-normal">
      <SectionForm />
      <SectionHelper />
    </FormLayout.Root>
  );
}
