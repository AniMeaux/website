import { Action } from "#core/actions.tsx";
import { useNavLink } from "#core/navigation.tsx";
import { NavLink } from "@remix-run/react";

export function Tabs({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="grid grid-flow-col gap-1 justify-center">{children}</div>
  );
}

export function Tab(props: React.ComponentPropsWithoutRef<typeof NavLink>) {
  const { isActive } = useNavLink(props);

  return (
    <Action asChild color={isActive ? "mystic" : "alabaster"}>
      <NavLink {...props} />
    </Action>
  );
}
