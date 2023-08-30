import { Icon } from "#generated/icon.tsx";
import { cn } from "@animeaux/core";

export function OptionList({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        // Ensure the list takes the entire viewport width for better overflow
        // indicators.
        "-mx-page w-screen min-w-0",
        "snap-x snap-mandatory scrollbars-none scroll-smooth overflow-x-auto flex items-start gap-3",
        // Because of `overflow-x-auto`, we need to ensure card shadows are
        // visible.
        "-my-6 py-6",
        "md:m-0 md:overflow-visible md:w-auto md:p-0 md:items-end md:justify-center md:gap-6",
      )}
    >
      {children}
    </div>
  );
}

export function OptionCard({ children }: { children: React.ReactNode }) {
  return (
    <section
      className={cn(
        // Because Safari and Firefox don't include scroll container's bottom
        // and left paddings in the scroll area, we can't have paddings on the
        // container (`OptionList`).
        // So we use negative margins and paddings to reduce the space between
        // items, while keeping spacing before the first and after the last
        // item.
        // https://github.com/w3c/csswg-drafts/issues/129#issuecomment-417525242
        "-mx-page px-page first:ml-0 last:mr-0",
        "snap-center w-11/12 first:last:w-full flex-none flex",
        "md:m-0 md:p-0 md:w-auto md:flex-1 md:max-w-sm",
      )}
    >
      <div className="shadow-base rounded-bubble-lg w-full bg-white p-6 flex flex-col gap-6">
        {children}
      </div>
    </section>
  );
}

export function OptionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-title-item">{children}</h3>;
}

export function OptionDescription({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}

export function OptionPrice({
  children,
  suffix,
}: {
  children: React.ReactNode;
  suffix?: string;
}) {
  return (
    <p>
      <span
        className={cn(
          "font-serif font-bold text-[32px] leading-normal",
          "md:text-[40px] md:leading-[1.2]",
        )}
      >
        {children}
      </span>

      {suffix != null && <span> {suffix}</span>}
    </p>
  );
}

export function OptionFeatureList({ children }: { children: React.ReactNode }) {
  return <ul className="flex flex-col">{children}</ul>;
}

export function OptionFeature({
  isIncluded = false,
  children,
}: {
  isIncluded?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-2">
      <span className="flex-none flex h-6 items-center">
        <Icon
          id={isIncluded ? "check" : "xMark"}
          className={isIncluded ? "text-brandGreen" : "text-brandRed"}
        />
      </span>

      {children}
    </li>
  );
}
