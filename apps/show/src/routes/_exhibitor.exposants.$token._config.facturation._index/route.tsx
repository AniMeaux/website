import { getErrorTitle } from "#core/data-display/error-page.js";
import { FormLayout } from "#core/layout/form-layout.js";
import { createSocialMeta } from "#core/meta.js";
import { getPageTitle } from "#core/page-title.js";
import type { MetaFunction } from "@remix-run/react";
import type { loader } from "./loader.server";
import { SectionBillingInfo } from "./section-billing-info";
import { SectionHelper } from "./section-helper";
import { SectionInvoices } from "./section-invoices";

export { loader } from "./loader.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null ? ["Facturation", data.exhibitor.name] : getErrorTitle(404),
    ),
  });
};

export default function Route() {
  return (
    <FormLayout.Root className="py-4 px-safe-page-narrow md:px-safe-page-normal">
      <FormLayout.Form asChild>
        <div>
          <SectionBillingInfo />
          <SectionInvoices />
        </div>
      </FormLayout.Form>

      <SectionHelper />
    </FormLayout.Root>
  );
}
