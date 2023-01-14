import { cn } from "~/core/classNames";

export function PageLayout({ children }: { children?: React.ReactNode }) {
  return <section className="flex flex-col gap-1 md:gap-2">{children}</section>;
}

export function PageContent({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={cn("my-1 md:my-2 md:px-2", className)}>{children}</main>
  );
}
