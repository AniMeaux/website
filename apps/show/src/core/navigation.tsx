import type { PreviousEdition } from "#previous-editions/previous-edition";
import type { NavLinkProps, Path } from "@remix-run/react";
import { useLocation, useNavigation, useResolvedPath } from "@remix-run/react";
import { useContext } from "react";
import { UNSAFE_NavigationContext } from "react-router";

export type To = string | Partial<Path>;

export const Routes = {
  exhibitorApplication: {
    toString: () => "/candidature-exposant" as const,

    confirmation: {
      applicationId: (applicationId: string) => ({
        toString: () => `/candidature-exposant/${applicationId}` as const,
      }),
    },
  },

  exhibitors: {
    toString: () => "/exposants" as const,

    token: (exhibitorToken: string) => ({
      toString: () => `/exposants/${exhibitorToken}` as const,

      animations: {
        toString: () => `/exposants/${exhibitorToken}/animations` as const,

        edit: {
          toString: () =>
            `/exposants/${exhibitorToken}/animations/modifier` as const,
        },
      },

      documents: {
        toString: () => `/exposants/${exhibitorToken}/documents` as const,

        edit: {
          toString: () =>
            `/exposants/${exhibitorToken}/documents/modifier` as const,
        },
      },

      faq: {
        toString: () => `/exposants/${exhibitorToken}/faq` as const,
      },

      profile: {
        toString: () => `/exposants/${exhibitorToken}/profil` as const,

        edit: {
          toString: () =>
            `/exposants/${exhibitorToken}/profil/modifier` as const,
        },
      },

      stand: {
        toString: () => `/exposants/${exhibitorToken}/stand` as const,

        edit: {
          toString: () =>
            `/exposants/${exhibitorToken}/stand/modifier` as const,
        },
      },
    }),
  },

  home: {
    toString: () => "/" as const,
  },

  previousEditions: {
    toString: () => "/editions-precedentes" as const,

    edition: (edition: PreviousEdition) => ({
      toString: () => `/editions-precedentes/${edition}` as const,

      photoIndex: (photoIndex: number) => ({
        toString: () =>
          `/editions-precedentes/${edition}/${photoIndex}` as const,
      }),
    }),
  },
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
