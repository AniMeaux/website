import { getErrorTitle } from "#core/data-display/error-page";
import { FormLayout } from "#core/layout/form-layout";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import type { MetaFunction } from "@remix-run/react";
import type { loader } from "./loader.server.js";
import { SectionDogs } from "./section-dogs";
import { SectionHelper } from "./section-helper";
import { SectionOnStageAnimations } from "./section-on-stage-animations.js";
import { SectionOnStandAnimations } from "./section-on-stand-animations.js";
import { SectionPerks } from "./section-perks.js";
import { SectionPrice } from "./section-price.js";
import { SectionStandConfiguration } from "./section-stand-configuration";

export { loader } from "./loader.server.js";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null ? ["Stand", data.exhibitor.name] : getErrorTitle(404),
    ),
  });
};

export default function Route() {
  return (
    <FormLayout.Root className="py-4 px-safe-page-narrow md:px-safe-page-normal">
      <FormLayout.Form asChild>
        <div>
          <SectionPrice />

          <FormLayout.SectionSeparator />

          <SectionStandConfiguration />

          <FormLayout.SectionSeparator />

          <SectionPerks />

          <FormLayout.SectionSeparator />

          <SectionDogs />

          <FormLayout.SectionSeparator />

          <SectionOnStageAnimations />

          <FormLayout.SectionSeparator />

          <SectionOnStandAnimations />
        </div>
      </FormLayout.Form>

      <SectionHelper />
    </FormLayout.Root>
  );
}
