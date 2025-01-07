import type { PreviousEdition } from "#previous-editions/previous-edition";
import type { Path } from "@remix-run/react";

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

        editPublicProfile: {
          toString: () =>
            `/exposants/${exhibitorToken}/profil/modifier-profil-public` as const,
        },

        editDescription: {
          toString: () =>
            `/exposants/${exhibitorToken}/profil/modifier-description` as const,
        },
      },

      stand: {
        toString: () => `/exposants/${exhibitorToken}/stand` as const,

        editStand: {
          toString: () =>
            `/exposants/${exhibitorToken}/stand/modifier-stand` as const,
        },

        editDogs: {
          toString: () =>
            `/exposants/${exhibitorToken}/stand/modifier-chiens` as const,
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
