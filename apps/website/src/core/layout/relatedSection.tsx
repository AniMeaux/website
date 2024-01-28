import { cn } from "@animeaux/core";
import { Children } from "react";
import { LineShapeHorizontal } from "./lineShape";

export function RelatedSection({ children }: { children: React.ReactNode }) {
  return (
    <aside
      className={cn(
        "flex w-full flex-col items-center gap-24 px-page pt-18",
        "md:pt-12",
      )}
    >
      <LineShapeHorizontal
        className={cn("h-4 w-full text-gray-300", "md:h-6")}
      />

      <div className="flex w-full flex-col gap-12">{children}</div>
    </aside>
  );
}

export function RelatedSectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h2
      className={cn(
        "text-center text-title-section-small",
        "md:text-left md:text-title-section-large",
      )}
    >
      {children}
    </h2>
  );
}

export function RelatedSectionList({
  children,
}: {
  children: React.ReactNode;
}) {
  const childrenCount = Children.count(children);

  return (
    <ul
      className={cn("grid grid-cols-1 items-start gap-12", "xs:grid-cols-2", {
        "md:grid-cols-3": childrenCount > 2,
      })}
    >
      {children}
    </ul>
  );
}
