import { cn } from "#core/classNames.ts";
import { Children } from "react";
import { LineShapeHorizontal } from "./lineShape";

export function RelatedSection({ children }: { children: React.ReactNode }) {
  return (
    <aside
      className={cn(
        "w-full px-page pt-18 flex flex-col items-center gap-24",
        "md:pt-12",
      )}
    >
      <LineShapeHorizontal
        className={cn("w-full h-4 text-gray-300", "md:h-6")}
      />

      <div className="w-full flex flex-col gap-12">{children}</div>
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
        "text-title-section-small text-center",
        "md:text-title-section-large md:text-left",
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
      className={cn("grid grid-cols-1 gap-12 items-start", "xs:grid-cols-2", {
        "md:grid-cols-3": childrenCount > 2,
      })}
    >
      {children}
    </ul>
  );
}
