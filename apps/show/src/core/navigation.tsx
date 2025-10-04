import type { ShowDay } from "#core/show-day";
import type { PreviousEdition } from "#previous-editions/previous-edition";
import type { SectionId } from "#routes/_exhibitor.exposants.$token._config.stand._index/section-id.js";
import type { Path } from "@remix-run/react";
import { createPath } from "@remix-run/react";

export type To = string | Partial<Path>;

export const Routes = {
  access: { toString: () => "/acces" as const },

  exhibitors: {
    toString: () => "/exposants" as const,

    application: {
      toString: () => "/exposants/candidature" as const,

      applicationId: (applicationId: string) => ({
        toString: () => `/exposants/candidature/${applicationId}` as const,
      }),
    },

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

      invoice: {
        toString: () => `/exposants/${exhibitorToken}/facturation` as const,

        edit: {
          toString: () =>
            `/exposants/${exhibitorToken}/facturation/modifier` as const,
        },
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
        toString: (section?: SectionId) =>
          createPath({
            pathname: `/exposants/${exhibitorToken}/stand`,
            hash: section ? `#${section}` : undefined,
          }),

        editStand: {
          toString: () =>
            `/exposants/${exhibitorToken}/stand/modifier-stand` as const,
        },

        editDogs: {
          toString: () =>
            `/exposants/${exhibitorToken}/stand/modifier-chiens` as const,
        },

        editPerks: {
          toString: () =>
            `/exposants/${exhibitorToken}/stand/modifier-avantages` as const,
        },
      },
    }),
  },

  faq: { toString: () => "/faq" as const },

  home: { toString: () => "/" as const },

  previousEditions: {
    toString: () => "/editions-precedentes" as const,

    edition: (edition: PreviousEdition) => ({
      toString: () => `/editions-precedentes/${edition}` as const,

      pictureIndex: (pictureIndex: number) => ({
        toString: () =>
          `/editions-precedentes/${edition}/${pictureIndex}` as const,
      }),
    }),
  },

  program: {
    toString: () => "/programme" as const,

    day: (day: ShowDay.Enum) => ({
      toString: () => `/programme/${day}` as const,
    }),
  },
};
