import { NavLink } from "@remix-run/react";
import { Action } from "~/core/actions";
import { useNavLink } from "~/core/navigation";

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
