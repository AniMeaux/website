import { Action } from "#core/actions/action";
import { useNavLink } from "#core/navigation";
import { cn } from "@animeaux/core";
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
  ...props
}: React.ComponentPropsWithoutRef<typeof NavLink>) {
  const { isActive } = useNavLink(props);

  return (
    <Action color={isActive ? "mystic" : "alabaster"} asChild>
      <NavLink preventScrollReset prefetch="intent" {...props}>
        {children}
      </NavLink>
    </Action>
  );
}
