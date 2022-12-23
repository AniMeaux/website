import { MetaFunction } from "@remix-run/node";
import { cn } from "~/core/classNames";
import { createSocialMeta } from "~/core/meta";
import { getPageTitle } from "~/core/pageTitle";

export const meta: MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle("Programme") });
};

export default function ProgramPage() {
  return (
    <main className="w-full px-page flex flex-col gap-12">
      <header className="flex flex-col">
        <h1
          className={cn(
            "w-full text-title-hero-small text-center",
            "md:text-title-hero-large"
          )}
        >
          Programme
        </h1>
      </header>

      <p className={cn("py-12 text-center text-gray-500", "md:px-30 md:py-40")}>
        Le programme sera transmis ultérieurement.
      </p>
    </main>
  );
}
