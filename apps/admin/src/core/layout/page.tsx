import type { BaseLinkProps } from "#core/baseLink.tsx";
import { BaseLink } from "#core/baseLink.tsx";
import { cn } from "@animeaux/core";
import { Children, isValidElement } from "react";

export function PageLayout({ children }: { children?: React.ReactNode }) {
  const hasTabs = Children.toArray(children).some(
    (child) => isValidElement(child) && child.type === PageLayout.Tabs,
  );

  return (
    <section
      className="flex flex-col"
      style={hasTabs ? { "--header-height": "130px" } : undefined}
    >
      {children}
    </section>
  );
}

PageLayout.Tabs = function PageTabs({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <nav className="bg-white py-0.5 overflow-auto scrollbars-none grid grid-flow-col justify-start gap-0.5 md:sticky md:top-6 md:z-20 md:border-l md:border-gray-50 md:py-1 md:gap-1">
      {children}
    </nav>
  );
};

PageLayout.Tab = function PageTab(props: Omit<BaseLinkProps, "className">) {
  return (
    <span className="flex flex-col first:pl-safe-1 last:pr-safe-1 md:first:pl-2 md:last:pr-2">
      <BaseLink
        {...props}
        className="rounded-0.5 px-1 py-0.5 flex text-body-emphasis transition-[color,background-color,transform] duration-100 ease-in-out text-gray-500 hover:bg-gray-100 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-500 hover:aria-[current=page]:bg-blue-50 active:scale-95 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      />
    </span>
  );
};

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
