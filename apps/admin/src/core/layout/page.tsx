import { cn } from "@animeaux/core";

export function PageLayout({ children }: { children?: React.ReactNode }) {
  return <section className="flex flex-col">{children}</section>;
}

PageLayout.Content = function PageContent({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={cn("my-1 md:my-2 md:px-2", className)}>{children}</main>
  );
};
