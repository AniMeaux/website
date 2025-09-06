import { Enums } from "#core/enums.js";
import { ImageLimits } from "#core/image/limits.js";
import { ActivityField } from "#exhibitors/activity-field/activity-field";
import { DiscoverySource } from "#exhibitors/application/discovery-source";
import { LegalStatus } from "#exhibitors/application/legal-status";
import { SponsorshipCategory } from "#exhibitors/sponsorship/category";
import { normalizeLineBreaks, simpleUrl, zu } from "@animeaux/zod-utils";
import type { ShowStandSize } from "@prisma/client";
import { ShowActivityTarget } from "@prisma/client";

export function createActionSchema(
  availableStandSizes: Pick<
    ShowStandSize,
    "id" | "isRestrictedByActivityField"
  >[],
) {
  return zu
    .object({
      documents: zu.object({
        acceptCharterAndHealthRegulation: zu.literal("on", {
          required_error:
            "Veuillez vous engager à respecter la charte et le règlement sanitaire",
        }),
        acceptInnerRegulation: zu.literal("on", {
          required_error:
            "Veuillez accepter le règlement et les tarifs pour finaliser votre inscription",
        }),
      }),

      contact: zu.object({
        lastname: zu
          .string({ required_error: "Veuillez entrer un nom" })
          .trim()
          .min(1, "Veuillez entrer un nom")
          .max(64, "Veuillez entrer un nom plus court"),
        firstname: zu
          .string({ required_error: "Veuillez entrer un prénom" })
          .trim()
          .min(1, "Veuillez entrer un prénom")
          .max(64, "Veuillez entrer un prénom plus court"),
        email: zu
          .string({ required_error: "Veuillez entrer une adresse e-mail" })
          .trim()
          .email("Veuillez entrer une adresse e-mail valide")
          .max(64, "Veuillez entrer une adresse e-mail plus courte"),
        phone: zu
          .string({ required_error: "Veuillez entrer un numéro de téléphone" })
          .trim()
          .regex(
            /^\+?[\s\d]+$/,
            "Veuillez entrer un numéro de téléphone valide",
          )
          .max(64, "Veuillez entrer un numéro de téléphone plus court"),
      }),

      structure: zu
        .object({
          name: zu
            .string({ required_error: "Veuillez entrer un nom" })
            .trim()
            .min(1, "Veuillez entrer un nom")
            .max(64, "Veuillez entrer un nom plus court"),
          url: zu
            .string({ required_error: "Veuillez entrer une URL" })
            .trim()
            .pipe(simpleUrl("Veuillez entrer une URL valide"))
            .pipe(zu.string().max(128, "Veuillez entrer une URL plus courte")),
          siret: zu
            .string({
              required_error: "Veuillez entrer un numéro d’identification",
            })
            .trim()
            .min(1, "Veuillez entrer un numéro d’identification")
            .max(128, "Veuillez entrer un numéro d’identification plus court"),
          address: zu
            .string({ required_error: "Veuillez entrer une adresse" })
            .trim()
            .min(1, "Veuillez entrer une adresse")
            .max(128, "Veuillez entrer une adresse plus courte"),
          zipCode: zu
            .string({ required_error: "Veuillez entrer un code postal" })
            .trim()
            .regex(/^\d+$/, "Veuillez entrer un code postal valide")
            .max(64, "Veuillez entrer un code postal plus court"),
          city: zu
            .string({ required_error: "Veuillez entrer une ville" })
            .trim()
            .min(1, "Veuillez entrer une ville")
            .max(128, "Veuillez entrer une ville plus courte"),
          country: zu
            .string({ required_error: "Veuillez entrer un pays" })
            .trim()
            .min(1, "Veuillez entrer un pays")
            .max(64, "Veuillez entrer un pays plus court"),
          haveCivilLiability: zu.literal("on", {
            required_error:
              "Vous devez en posséder une responsabilité civile professionnelle",
          }),
          activityDescription: zu.preprocess(
            normalizeLineBreaks,
            zu
              .string({ required_error: "Veuillez entrer une description" })
              .trim()
              .min(1, "Veuillez entrer une description")
              .max(300, "Veuillez entrer une description plus courte"),
          ),
          activityTargets: zu.repeatable(
            zu
              .array(zu.nativeEnum(ShowActivityTarget))
              .min(1, "Veuillez choisir une cible"),
          ),
          activityFields: zu.repeatable(
            zu
              .array(zu.nativeEnum(ActivityField.Enum))
              .min(1, "Veuillez choisir un domaine d’activité")
              .max(
                ActivityField.MAX_COUNT,
                `Veuillez choisir au plus ${ActivityField.MAX_COUNT} domaines d’activité`,
              ),
          ),
          logo: zu
            .instanceof(File, { message: "Veuillez choisir un logo" })
            .refine(
              (file) => file.size <= ImageLimits.MAX_SIZE_B,
              `Le logo doit faire moins de ${ImageLimits.MAX_SIZE_MB} MB`,
            ),
        })
        .and(
          zu.discriminatedUnion(
            "legalStatus",
            [
              zu.object({
                legalStatus: zu.literal(LegalStatus.Enum.OTHER),
                legalStatusOther: zu
                  .string({
                    required_error: "Veuillez entrer une forme juridique",
                  })
                  .trim()
                  .min(1, "Veuillez entrer une forme juridique")
                  .max(64, "Veuillez entrer une forme juridique plus courte"),
              }),
              zu.object({
                legalStatus: zu.nativeEnum(
                  Enums.omit(LegalStatus.Enum, [LegalStatus.Enum.OTHER]),
                ),
                legalStatusOther: zu.undefined(),
              }),
            ],
            {
              // When `legalStatus` is not defined, the issue is a
              // "invalid_union_discriminator" and its message can only be
              // customized using `errorMap`.
              errorMap: (issue, context) => {
                if (
                  issue.code === zu.ZodIssueCode.invalid_union_discriminator
                ) {
                  return { message: "Veuillez choisir une forme juridique" };
                }

                return { message: context.defaultError };
              },
            },
          ),
        ),

      participation: zu.object({
        desiredStandSizeId: zu
          .string({ required_error: "Veuillez choisir une taille de stand" })
          .uuid()
          .refine(
            (standSizeId) =>
              availableStandSizes.some(
                (availableStandSize) => availableStandSize.id === standSizeId,
              ),
            { message: "Veuillez choisir une taille de stand" },
          ),

        proposalForOnStageEntertainment: zu.preprocess(
          normalizeLineBreaks,
          zu
            .string()
            .trim()
            .max(500, "Veuillez entrer un text plus court")
            .optional(),
        ),
      }),

      sponsorshipCategory: zu.nativeEnum(SponsorshipCategory.Enum, {
        required_error: "Veuillez choisir une option",
      }),

      comments: zu
        .object({
          motivation: zu.preprocess(
            normalizeLineBreaks,
            zu
              .string({ required_error: "Veuillez entrer une réponse" })
              .trim()
              .min(1, "Veuillez entrer une réponse")
              .max(1000, "Veuillez entrer une réponse plus courte"),
          ),

          comments: zu.preprocess(
            normalizeLineBreaks,
            zu
              .string()
              .trim()
              .max(500, "Veuillez entrer un commentaire plus court")
              .optional(),
          ),
        })
        .and(
          zu.discriminatedUnion(
            "discoverySource",
            [
              zu.object({
                discoverySource: zu.literal(DiscoverySource.Enum.OTHER),
                discoverySourceOther: zu
                  .string({ required_error: "Veuillez entrer une réponse" })
                  .trim()
                  .min(1, "Veuillez entrer une réponse")
                  .max(128, "Veuillez entrer une réponse plus courte"),
              }),
              zu.object({
                discoverySource: zu.nativeEnum(
                  Enums.omit(DiscoverySource.Enum, [
                    DiscoverySource.Enum.OTHER,
                  ]),
                ),
                discoverySourceOther: zu.undefined(),
              }),
            ],
            {
              // When `discoverySource` is not defined, the issue is a
              // "invalid_union_discriminator" and its message can only be
              // customized using `errorMap`.
              errorMap: (issue, context) => {
                if (
                  issue.code === zu.ZodIssueCode.invalid_union_discriminator
                ) {
                  return { message: "Veuillez choisir une option" };
                }

                return { message: context.defaultError };
              },
            },
          ),
        ),

      personalData: zu.object({
        acceptDataUsage: zu.literal("on", {
          required_error:
            "Vous devez accepter l’utilisation de vos données pour le traitement de votre candidature",
        }),
        acceptEmails: zu.literal("on", {
          required_error:
            "Vous devez accepter de recevoir les informations exposants",
        }),
      }),
    })
    .refine(
      (value) => {
        const hasLimitedStandSize = value.structure.activityFields.some(
          (activityField) =>
            ActivityField.valuesWithLimitedStandSizes.includes(activityField),
        );

        if (!hasLimitedStandSize) {
          return true;
        }

        const limitedAvailableStandSizes = availableStandSizes.filter(
          (availableStandSize) =>
            !availableStandSize.isRestrictedByActivityField,
        );

        return limitedAvailableStandSizes.some(
          (availableStandSize) =>
            availableStandSize.id === value.participation.desiredStandSizeId,
        );
      },
      {
        message: "Veuillez choisir une taille de stand",
        path: ["participation", "desiredStandSizeId"],
      },
    );
}
