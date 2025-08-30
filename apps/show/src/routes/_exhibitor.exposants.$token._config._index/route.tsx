import { getErrorTitle } from "#core/data-display/error-page";
import { FormLayout } from "#core/layout/form-layout";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import type { MetaFunction } from "@remix-run/react";
import type { loader } from "./loader.server";
import { SectionAwaitingValidation } from "./section-awaiting-validation";
import { SectionHelper } from "./section-helper";
import { SectionPayment } from "./section-payment";
import { SectionSponsorship } from "./section-sponsorship";
import { SectionStandNumber } from "./section-stand-number";
import { SectionToComplete } from "./section-to-complete";
import { SectionValidated } from "./section-validated";

export { loader } from "./loader.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null
        ? ["Tableau de bord", data.exhibitor.name]
        : getErrorTitle(404),
    ),
  });
};

export default function Route() {
  return (
    <FormLayout.Root className="py-4 px-safe-page-narrow md:px-safe-page-normal">
      <FormLayout.Form asChild>
        <div>
          <SectionStandNumber />
          <SectionPayment />

          <SectionToComplete />
          <SectionAwaitingValidation />
          <SectionValidated />

          <SectionSponsorship />
        </div>
      </FormLayout.Form>

      <SectionHelper />
    </FormLayout.Root>
  );
}
