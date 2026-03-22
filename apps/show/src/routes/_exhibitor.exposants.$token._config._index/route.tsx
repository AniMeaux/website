import type { MetaFunction } from "@remix-run/react"

import { getErrorTitle } from "#i/core/data-display/error-page.js"
import { FormLayout } from "#i/core/layout/form-layout.js"
import { createSocialMeta } from "#i/core/meta.js"
import { getPageTitle } from "#i/core/page-title.js"

import type { loader } from "./loader.server.js"
import { SectionAwaitingValidation } from "./section-awaiting-validation.js"
import { SectionDocuments } from "./section-documents.js"
import { SectionHelper } from "./section-helper.js"
import { SectionLaureat } from "./section-laureat.js"
import { SectionPayment } from "./section-payment.js"
import { SectionSponsorship } from "./section-sponsorship.js"
import { SectionStandNumber } from "./section-stand-number.js"
import { SectionToComplete } from "./section-to-complete.js"
import { SectionValidated } from "./section-validated.js"

export { loader } from "./loader.server.js"

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null
        ? ["Tableau de bord", data.exhibitor.name]
        : getErrorTitle(404),
    ),
  })
}

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

          <SectionLaureat />

          <SectionDocuments />
        </div>
      </FormLayout.Form>

      <SectionHelper />
    </FormLayout.Root>
  )
}
