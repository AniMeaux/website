import { callFactory, cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { NavLink } from "@remix-run/react";
import { forwardRef } from "react";

export const Tabs = forwardRef<
  React.ComponentRef<typeof Primitive.div>,
  React.ComponentPropsWithoutRef<typeof Primitive.div>
>(function Tabs({ className, ...props }, ref) {
  return (
    <Primitive.div
      {...props}
      ref={ref}
      className={cn("grid grid-flow-col justify-start gap-0.5", className)}
    />
  );
});

export function Tab({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof NavLink>) {
  return (
    <NavLink
      preventScrollReset
      prefetch="intent"
      {...props}
      className={(props) =>
        cn(
          "rounded-0.5 px-1 py-0.5 transition-colors duration-normal",
          props.isActive
            ? "bg-alabaster text-body-lowercase-emphasis can-hover:focus-visible:focus-spaced"
            : "text-body-lowercase-default can-hover:hover:bg-alabaster-50 can-hover:focus-visible:focus-compact",
          callFactory(className, () => props),
        )
      }
    >
      {children}
    </NavLink>
  );
}
