import { Action } from "#core/actions";
import { useNavLink } from "#core/navigation";
import { NavLink } from "@remix-run/react";

export function Tabs({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="grid grid-flow-col justify-center gap-1">{children}</div>
  );
}

export function Tab({
  children,
  ...rest
}: React.ComponentPropsWithoutRef<typeof NavLink>) {
  const { isActive } = useNavLink(rest);

  return (
    <Action asChild color={isActive ? "mystic" : "alabaster"}>
      <NavLink {...rest}>{children}</NavLink>
    </Action>
  );
}
