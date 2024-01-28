import type { ShowDay } from "#core/dates";
import type { PreviousEdition } from "#previousEditions/previousEdition";
import type { NavLinkProps } from "@remix-run/react";
import { useLocation, useNavigation, useResolvedPath } from "@remix-run/react";
import { useContext } from "react";
import { UNSAFE_NavigationContext } from "react-router";

export const Routes = {
  home: () => "/",
  exhibitors: () => "/exposants",
  program: (day?: ShowDay) => ["/programme", day].filter(Boolean).join("/"),
  access: () => "/acces",
  faq: () => "/faq",
  previousEditions: (edition?: PreviousEdition) =>
    ["/editions-precedentes", edition].filter(Boolean).join("/"),
  photo: (edition: PreviousEdition, photoIndex: number) =>
    ["/editions-precedentes", edition, photoIndex].join("/"),
};

/**
 * Hook version of `NavLink` so it can be used outside of the component.
 *
 * @param to
 * @see https://github.com/remix-run/react-router/blob/react-router%406.14.2/packages/react-router-dom/index.tsx#L624
 */
export function useNavLink(
  props: Pick<NavLinkProps, "caseSensitive" | "end" | "relative" | "to">,
) {
  const path = useResolvedPath(props.to, { relative: props.relative });
  const location = useLocation();
  const navigation = useNavigation();
  const { navigator } = useContext(UNSAFE_NavigationContext);

  let toPathname = navigator.encodeLocation
    ? navigator.encodeLocation(path).pathname
    : path.pathname;
  let locationPathname = location.pathname;
  let nextLocationPathname = navigation.location?.pathname ?? null;

  if (!props.caseSensitive) {
    locationPathname = locationPathname.toLowerCase();
    nextLocationPathname = nextLocationPathname
      ? nextLocationPathname.toLowerCase()
      : null;
    toPathname = toPathname.toLowerCase();
  }

  const isActive =
    locationPathname === toPathname ||
    (!props.end &&
      locationPathname.startsWith(toPathname) &&
      locationPathname.charAt(toPathname.length) === "/");

  const isPending =
    nextLocationPathname != null &&
    (nextLocationPathname === toPathname ||
      (!props.end &&
        nextLocationPathname.startsWith(toPathname) &&
        nextLocationPathname.charAt(toPathname.length) === "/"));

  return { isActive, isPending };
}
