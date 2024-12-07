import { BaseLink } from "#core/base-link";
import { cn } from "@animeaux/core";
import { Children, isValidElement } from "react";

export const PageLayout = {
  Root: function PageLayoutRoot({ children }: React.PropsWithChildren<{}>) {
    const hasTabs = Children.toArray(children).some(
      (child) => isValidElement(child) && child.type === PageLayout.Tabs,
    );

    return (
      <section
        className="flex flex-col"
        style={hasTabs ? { "--header-height": "110px" } : undefined}
      >
        {children}
      </section>
    );
  },

  Tabs: function PageLayoutTabs(props: React.PropsWithChildren<{}>) {
    return (
      <nav
        {...props}
        className="grid grid-flow-col justify-start gap-0.5 overflow-auto bg-white py-0.5 scrollbars-none md:sticky md:top-6 md:z-20 md:gap-1 md:border-l md:border-gray-50 md:py-1"
      />
    );
  },

  Tab: function PageLayoutTab(
    props: Omit<React.ComponentPropsWithoutRef<typeof BaseLink>, "className">,
  ) {
    return (
      <span className="flex flex-col first:pl-safe-1 last:pr-safe-1 md:first:pl-2 md:last:pr-2">
        <BaseLink
          {...props}
          className="flex rounded-0.5 px-1 py-0.5 text-gray-500 transition-[color,background-color,transform] duration-100 text-body-emphasis active:scale-95 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-500 focus-visible:focus-spaced-blue-400 hover:bg-gray-100 hover:aria-[current=page]:bg-blue-50"
        />
      </span>
    );
  },

  Content: function PageLayoutContent({
    className,
    ...props
  }: React.PropsWithChildren<{ className?: string }>) {
    return (
      <main {...props} className={cn("my-1 md:my-2 md:px-2", className)} />
    );
  },
};
