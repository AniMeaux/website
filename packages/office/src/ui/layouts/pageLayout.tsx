import cn from "classnames";
import * as React from "react";

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

      <div className="md:flex-1 md:flex md:min-h-0">{children}</div>
    </div>
  );
}
