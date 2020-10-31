import cn from "classnames";
import Head from "next/head";
import * as React from "react";

type PageTitleProps = {
  title?: string | null;
};

export function PageTitle({ title }: PageTitleProps) {
  const pageTitle = title ?? "Meaux'Pets";

  return (
    <Head>
      <title>{pageTitle}</title>
    </Head>
  );
}

type MainProps = React.HTMLAttributes<HTMLElement> & {
  center?: boolean;
};

export function Main({ center = false, className, ...rest }: MainProps) {
  return (
    <main
      {...rest}
      className={cn(
        "md:min-w-0 md:min-h-0 md:overflow-auto pt-4 pb-36 md:pb-20",
        {
          "md:mx-auto md:w-10/12 md:max-w-screen-md": center,
          "md:flex-1": !center,
        },
        className
      )}
    />
  );
}

type PageLayoutProps = React.HTMLAttributes<HTMLDivElement> & {
  header: React.ReactNode;
};

export function PageLayout({
  header,
  children,
  className,
  ...rest
}: PageLayoutProps) {
  return (
    <div
      {...rest}
      className={cn("md:flex-1 md:min-w-0 md:flex md:flex-col", className)}
    >
      {header}

      <div className="md:flex-1 md:min-h-0 md:flex md:items-stretch">
        {children}
      </div>
    </div>
  );
}
