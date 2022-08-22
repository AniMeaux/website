import { cn } from "~/core/classNames";

export default function ExhibitorsPage() {
  return (
    <main className="w-full px-page flex flex-col gap-12">
      <header className="flex flex-col">
        <h1
          className={cn(
            "w-full px-4 text-title-hero-small text-center",
            "md:px-0 md:text-title-hero-large"
          )}
        >
          Exposants
        </h1>
      </header>

      <p className={cn("px-4 py-12 text-center text-gray-500", "md:py-40")}>
        La liste des exposants sera transmise ultérieurement
      </p>
    </main>
  );
}
