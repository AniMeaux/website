import { cn } from "@animeaux/core";

export function Card({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn(className, "flex flex-col bg-white bg-var-white")}>
      {children}
    </section>
  );
}

Card.Header = function CardHeader({
  children,
  className,
  isVertical = false,
}: {
  children?: React.ReactNode;
  className?: string;
  isVertical?: boolean;
}) {
  return (
    <header
      className={cn(
        className,
        "flex flex-none bg-white p-1 bg-var-white md:p-2",
        isVertical ? "flex-col gap-1" : "gap-1 md:gap-2",
      )}
    >
      {children}
    </header>
  );
};

Card.Title = function CardTitle({ children }: { children?: React.ReactNode }) {
  return (
    <h2 className="flex-1 text-title-section-small md:text-title-section-large">
      {children}
    </h2>
  );
};

Card.Content = function CardContent({
  children,
  hasHorizontalScroll = false,
  hasVerticalScroll = false,
  hasListItems = false,
}: {
  children?: React.ReactNode;
  hasHorizontalScroll?: boolean;
  hasVerticalScroll?: boolean;
  hasListItems?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 first:pt-1 last:pb-1 md:gap-2 md:first:pt-2 md:last:pb-2",
        hasHorizontalScroll
          ? "overflow-x-auto scrollbars-none"
          : hasListItems
            ? "px-0.5 md:px-1"
            : "px-1 md:px-2",
        hasVerticalScroll
          ? "flex-1 overflow-y-scroll overscroll-contain scrollbars-custom"
          : "flex-auto",
      )}
    >
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <footer
      className={cn(
        className,
        "flex flex-none gap-1 bg-white p-1 bg-var-white md:gap-2 md:p-2",
      )}
    >
      {children}
    </footer>
  );
};
