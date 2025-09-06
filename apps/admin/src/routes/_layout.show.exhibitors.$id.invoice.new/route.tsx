import { Action } from "#core/actions.js";
import { ErrorPage, getErrorTitle } from "#core/data-display/error-page.js";
import { PageLayout } from "#core/layout/page.js";
import { getPageTitle } from "#core/page-title.js";
import { FieldsetInvoice } from "#show/invoice/fieldset-invoice.js";
import { getFormProps } from "@conform-to/react";
import type { MetaFunction } from "@remix-run/react";
import { useFormRoot } from "./form";
import type { loader } from "./loader.server";

export { action } from "./action.server";
export { loader } from "./loader.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: getPageTitle(
        data != null
          ? [`Modifier ${data.exhibitor.name}`, "Nouvelle facture"]
          : getErrorTitle(404),
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
  const [form, fields, fetcher] = useFormRoot();

  return (
    <PageLayout.Content className="grid grid-cols-1 justify-center md:grid-cols-[minmax(0,600px)]">
      <fetcher.Form
        {...getFormProps(form)}
        method="POST"
        className="grid grid-cols-1 gap-1 md:gap-2"
      >
        <FieldsetInvoice form={form} fields={fields} />

        <Action type="submit" className="mx-1.5 md:mx-0 md:justify-self-end">
          Créer
          <Action.Loader isLoading={fetcher.state !== "idle"} />
        </Action>
      </fetcher.Form>
    </PageLayout.Content>
  );
}
