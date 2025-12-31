import { Action } from "#i/core/actions.js";
import { ErrorPage } from "#i/core/data-display/error-page.js";
import { PageLayout } from "#i/core/layout/page.js";
import { getPageTitle } from "#i/core/page-title.js";
import { FieldsetDetails } from "#i/show/stand-size/fieldset-details.js";
import { FieldsetIdentification } from "#i/show/stand-size/fieldset-identification.js";
import { FieldsetPrices } from "#i/show/stand-size/fieldset-prices.js";
import { FieldsetSituation } from "#i/show/stand-size/fieldset-situation.js";
import { getFormProps } from "@conform-to/react";
import type { MetaFunction } from "@remix-run/react";
import { useFormRoot } from "./form.js";
import type { loader } from "./loader.server.js";

export { action } from "./action.server.js";
export { loader } from "./loader.server.js";

export const meta: MetaFunction<typeof loader> = () => {
  return [{ title: getPageTitle("Nouvelle taille de stand") }];
};

export function ErrorBoundary() {
  return (
    <PageLayout.Content className="grid grid-cols-1">
      <ErrorPage />
    </PageLayout.Content>
  );
}

export default function Route() {
  const [form, fields, fetcher] = useFormRoot();

  return (
    <PageLayout.Content className="grid grid-cols-1 justify-center md:grid-cols-[minmax(0,600px)]">
      <fetcher.Form
        {...getFormProps(form)}
        method="POST"
        className="grid grid-cols-1 gap-1 md:gap-2"
      >
        <FieldsetIdentification form={form} fields={fields} />

        <FieldsetSituation fields={fields} />

        <FieldsetDetails fields={fields} />

        <FieldsetPrices fields={fields} />

        <Action type="submit" className="mx-1.5 md:mx-0 md:justify-self-end">
          Créer
          <Action.Loader isLoading={fetcher.state !== "idle"} />
        </Action>
      </fetcher.Form>
    </PageLayout.Content>
  );
}
