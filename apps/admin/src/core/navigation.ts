import type { LocationState } from "#core/location-state";
import { useLocationState } from "#core/location-state";
import type { NavigateFunction } from "@remix-run/react";
import { useNavigate as useBaseNavigate } from "@remix-run/react";
import { useCallback, useEffect } from "react";
import type { NavigateOptions, To } from "react-router";

export const Routes = {
  home: { toString: () => "/" as const },
  dashboard: { toString: () => "/dashboard" as const },
  animals: {
    toString: () => "/animals" as const,
    id: (id: string) =>
      ({
        toString: () => `/animals/${id}` as const,
        edit: {
          pictures: { toString: () => `/animals/${id}/edit/pictures` as const },
          profile: { toString: () => `/animals/${id}/edit/profile` as const },
          situation: {
            toString: () => `/animals/${id}/edit/situation` as const,
          },
        },
        pictures: {
          pictureId: (pictureId: string) => ({
            toString: () => `/animals/${id}/pictures/${pictureId}` as const,
          }),
        },
      }) as const,
    new: {
      profile: { toString: () => "/animals/new/profile" as const },
      situation: { toString: () => "/animals/new/situation" as const },
      pictures: { toString: () => "/animals/new/pictures" as const },
    },
  },
  breeds: {
    toString: () => "/breeds" as const,
    id: (id: string) => ({
      edit: { toString: () => `/breeds/${id}/edit` as const },
    }),
    new: { toString: () => "/breeds/new" as const },
  },
  colors: {
    toString: () => "/colors" as const,
    id: (id: string) => ({
      edit: { toString: () => `/colors/${id}/edit` as const },
    }),
    new: { toString: () => "/colors/new" as const },
  },
  events: {
    toString: () => "/events" as const,
    id: (id: string) => ({
      toString: () => `/events/${id}` as const,
      edit: { toString: () => `/events/${id}/edit` as const },
    }),
    new: { toString: () => "/events/new" as const },
  },
  fosterFamilies: {
    toString: () => "/foster-families" as const,
    id: (id: string) => ({
      toString: () => `/foster-families/${id}` as const,
      edit: { toString: () => `/foster-families/${id}/edit` as const },
    }),
    new: { toString: () => "/foster-families/new" as const },
  },
  me: {
    toString: () => "/me" as const,
    changePassword: { toString: () => "/me/change-password" as const },
    editProfile: { toString: () => "/me/edit-profile" as const },
  },
  pressArticles: {
    toString: () => "/press-articles" as const,
    add: { toString: () => "/press-articles/add" as const },
  },
  show: {
    toString: () => "/show" as const,

    applications: {
      toString: () => "/show/applications" as const,

      id: (id: string) => ({
        toString: () => `/show/applications/${id}` as const,

        edit: { toString: () => `/show/applications/${id}/edit` as const },
      }),
    },

    exhibitors: {
      toString: () => "/show/exhibitors" as const,

      id: (id: string) => ({
        toString: () => `/show/exhibitors/${id}` as const,

        edit: {
          description: {
            toString: () => `/show/exhibitors/${id}/edit/description` as const,
          },

          documents: {
            toString: () => `/show/exhibitors/${id}/edit/documents` as const,
          },

          dogsConfiguration: {
            toString: () =>
              `/show/exhibitors/${id}/edit/dogs-configuration` as const,
          },

          onStandAnimations: {
            toString: () =>
              `/show/exhibitors/${id}/edit/on-stand-animations` as const,
          },

          publicProfile: {
            toString: () =>
              `/show/exhibitors/${id}/edit/public-profile` as const,
          },

          situation: {
            toString: () => `/show/exhibitors/${id}/edit/situation` as const,
          },

          standConfiguration: {
            toString: () =>
              `/show/exhibitors/${id}/edit/stand-configuration` as const,
          },

          structure: {
            toString: () => `/show/exhibitors/${id}/edit/structure` as const,
          },
        },

        invoice: {
          id: (invoiceId: string) => ({
            edit: {
              toString: () =>
                `/show/exhibitors/${id}/invoice/${invoiceId}/edit` as const,
            },
          }),

          new: {
            toString: () => `/show/exhibitors/${id}/invoice/new` as const,
          },
        },
      }),
    },

    sponsors: {
      toString: () => "/show/sponsors" as const,

      id: (id: string) => ({
        toString: () => `/show/sponsors/${id}` as const,
      }),
    },
  },
  users: {
    toString: () => "/users" as const,
    id: (id: string) => ({
      toString: () => `/users/${id}` as const,
      edit: { toString: () => `/users/${id}/edit` as const },
    }),
    new: { toString: () => "/users/new" as const },
  },
  activity: {
    toString: () => "/activity" as const,
    id: (id: string) => ({
      toString: () => `/activity/${id}` as const,
    }),
  },
  definePassword: { toString: () => "/define-password" as const },
  downloads: {
    animals: {
      toString: () => "/downloads/animals" as const,
    },
    picture: {
      id: (id: string) => ({
        toString: () => `/downloads/picture/${id}` as const,
      }),
    },
  },
  login: { toString: () => "/login" as const },
  logout: { toString: () => "/logout" as const },
  resources: {
    breed: { toString: () => "/resources/breed" as const },
    color: { toString: () => "/resources/color" as const },
    fosterFamily: { toString: () => "/resources/foster-family" as const },
    globalSearch: { toString: () => "/resources/global-search" as const },
    manager: { toString: () => "/resources/manager" as const },
    pickUpLocation: { toString: () => "/resources/pick-up-location" as const },
    preferences: { toString: () => "/resources/preferences" as const },
    scrapUrl: { toString: () => "/resources/scrap-url" as const },
  },
};

export function useBackIfPossible({
  fallbackRedirectTo,
}: {
  fallbackRedirectTo?: string;
}) {
  const { fromApp } = useLocationState();
  const navigate = useNavigate();

  useEffect(() => {
    if (fallbackRedirectTo != null) {
      if (fromApp) {
        navigate(-1);
      } else {
        navigate(fallbackRedirectTo);
      }
    }
  }, [fallbackRedirectTo, navigate, fromApp]);
}

export function useNavigate() {
  const { fromApp } = useLocationState();
  const navigate = useBaseNavigate();

  return useCallback<NavigateFunction>(
    (to: To | number, options?: NavigateOptions) => {
      if (typeof to === "number") {
        return navigate(to);
      }

      return navigate(to, {
        ...options,
        state: {
          fromApp: !options?.replace || fromApp,
        } satisfies LocationState,
      });
    },
    [navigate, fromApp],
  );
}
