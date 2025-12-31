import { Action } from "#i/core/actions";
import { ErrorPage, getErrorTitle } from "#i/core/data-display/error-page";
import { PageLayout } from "#i/core/layout/page";
import { getPageTitle } from "#i/core/page-title";
import { getFormProps } from "@conform-to/react";
import type { MetaFunction } from "@remix-run/react";
import { FieldsetConfiguration } from "./fieldset-configuration";
import { FieldsetPriceDetails } from "./fieldset-price-details";
import { FieldsetStatus } from "./fieldset-status";
import { FormProvider, useFormRoot } from "./form";
import type { loader } from "./loader.server.js";

export { action } from "./action.server.js";
export { loader } from "./loader.server.js";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: getPageTitle(
        data?.exhibitor.name != null
          ? [`Modifier ${data.exhibitor.name}`, "Configuration de stand"]
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
    <FormProvider form={form} fields={fields}>
      <PageLayout.Content className="grid grid-cols-1 justify-center md:grid-cols-[minmax(0,600px)]">
        <fetcher.Form
          {...getFormProps(form)}
          method="POST"
          className="grid grid-cols-1 gap-1 md:gap-2"
        >
          <FieldsetStatus />
          <FieldsetConfiguration />
          <FieldsetPriceDetails />

          <Action type="submit" className="mx-1.5 md:mx-0 md:justify-self-end">
            Enregistrer
            <Action.Loader isLoading={fetcher.state !== "idle"} />
          </Action>
        </fetcher.Form>
      </PageLayout.Content>
    </FormProvider>
  );
}
