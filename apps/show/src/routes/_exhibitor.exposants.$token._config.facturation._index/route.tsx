import type { MetaFunction } from "@remix-run/react"

import { getErrorTitle } from "#i/core/data-display/error-page.js"
import { FormLayout } from "#i/core/layout/form-layout.js"
import { createSocialMeta } from "#i/core/meta.js"
import { getPageTitle } from "#i/core/page-title.js"

import type { loader } from "./loader.server.js"
import { SectionBillingInfo } from "./section-billing-info.js"
import { SectionHelper } from "./section-helper.js"
import { SectionInvoices } from "./section-invoices.js"

export { loader } from "./loader.server.js"

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null ? ["Facturation", data.exhibitor.name] : getErrorTitle(404),
    ),
  })
}

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
  )
}
