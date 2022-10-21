import { cn } from "~/core/classNames";

export function Card({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn(className, "bg-white flex flex-col")}>
      {children}
    </section>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        className,
        "flex-none bg-white p-1 flex gap-1 md:p-2 md:gap-2"
      )}
    >
      {children}
    </header>
  );
}

export function CardTitle({ children }: { children?: React.ReactNode }) {
  return (
    <h2 className="flex-1 text-title-section-small md:text-title-section-large">
      {children}
    </h2>
  );
}

export function CardContent({
  children,
  hasHorizontalScroll = false,
  hasVerticalScroll = false,
}: {
  children?: React.ReactNode;
  hasHorizontalScroll?: boolean;
  hasVerticalScroll?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col first:pt-1 last:pb-1 md:first:pt-2 md:last:pb-2",
        hasHorizontalScroll
          ? "scrollbars-none overflow-x-auto"
          : "px-1 md:px-2",
        {
          "flex-1 overflow-y-auto scrollbars-custom overscroll-contain":
            hasVerticalScroll,
        }
      )}
    >
      {children}
    </div>
  );
}

export function CardFooter({
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
        "flex-none bg-white p-1 flex gap-1 md:p-2 md:gap-2"
      )}
    >
      {children}
    </footer>
  );
}
