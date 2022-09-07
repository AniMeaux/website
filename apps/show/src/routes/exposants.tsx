import { MetaFunction } from "@remix-run/node";
import { actionClassNames } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { useConfig } from "~/core/config";
import { createSocialMeta } from "~/core/meta";
import { getPageTitle } from "~/core/pageTitle";

export const meta: MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle("Exposants") });
};

export default function ExhibitorsPage() {
  return (
    <main className="w-full px-page flex flex-col gap-12">
      <header
        className={cn("flex flex-col", "md:flex-row md:items-center md:gap-6")}
      >
        <h1
          className={cn(
            "px-4 text-title-hero-small text-center",
            "md:flex-1 md:px-0 md:text-title-hero-large md:text-left"
          )}
        >
          Exposants
        </h1>

        <div className={cn("hidden", "md:flex-none md:flex")}>
          <BecomeExhibitor />
        </div>
      </header>

      <p className={cn("px-4 py-12 text-center text-gray-500", "md:py-40")}>
        La liste des exposants sera transmise ultérieurement.
      </p>

      <div className={cn("flex justify-center", "md:hidden")}>
        <BecomeExhibitor />
      </div>
    </main>
  );
}

function BecomeExhibitor() {
  const { exhibitorsFormUrl } = useConfig();

  return (
    <BaseLink to={exhibitorsFormUrl} className={actionClassNames.standalone()}>
      Devenir exposant
    </BaseLink>
  );
}
