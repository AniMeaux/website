import { Action } from "#i/core/actions.js";
import { ErrorPage, getErrorTitle } from "#i/core/data-display/error-page.js";
import { PageLayout } from "#i/core/layout/page.js";
import { getPageTitle } from "#i/core/page-title.js";
import { FieldsetDetails } from "#i/show/stand-size/fieldset-details.js";
import { FieldsetIdentification } from "#i/show/stand-size/fieldset-identification.js";
import { FieldsetPrices } from "#i/show/stand-size/fieldset-prices.js";
import { FieldsetSituation } from "#i/show/stand-size/fieldset-situation.js";
import { getFormProps } from "@conform-to/react";
import type { MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { useFormRoot } from "./form.js";
import type { loader } from "./loader.server.js";

export { action } from "./action.server.js";
export { loader } from "./loader.server.js";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: getPageTitle(
        data != null ? `Modifier ${data.standSize.label}` : getErrorTitle(404),
      ),
    },
  ];
};

export function ErrorBoundary() {
  return (
    <PageLayout.Content className="grid grid-cols-1">
      <ErrorPage />
    </PageLayout.Content>
  );
}

export default function Route() {
  const { standSize } = useLoaderData<typeof loader>();
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

        <FieldsetDetails bookedCount={standSize.bookedCount} fields={fields} />

        <FieldsetPrices fields={fields} />

        <Action type="submit" className="mx-1.5 md:mx-0 md:justify-self-end">
          Enregistrer
          <Action.Loader isLoading={fetcher.state !== "idle"} />
        </Action>
      </fetcher.Form>
    </PageLayout.Content>
  );
}
