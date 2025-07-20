import { SMALL_SIZED_STANDS_ACTIVITY_FIELDS } from "#exhibitors/activity-field/activity-field";
import { OTHER_SHOW_LEGAL_STATUS } from "#exhibitors/application/legal-status";
import { isLargeStandSize } from "#exhibitors/stand-size/stand-size";
import {
  IMAGE_SIZE_LIMIT_B,
  IMAGE_SIZE_LIMIT_MB,
} from "@animeaux/cloudinary/client";
import { normalizeLineBreaks, simpleUrl, zu } from "@animeaux/zod-utils";
import {
  ShowActivityField,
  ShowActivityTarget,
  ShowExhibitorApplicationLegalStatus,
  ShowExhibitorApplicationOtherPartnershipCategory,
  ShowPartnershipCategory,
  ShowStandSize,
} from "@prisma/client";

export const ActionSchema = zu
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
        .regex(/^\+?[\s\d]+$/, "Veuillez entrer un numéro de téléphone valide")
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
        activityTargets: zu.repeatable(
          zu
            .array(zu.nativeEnum(ShowActivityTarget))
            .min(1, "Veuillez choisir une cible"),
        ),
        activityFields: zu.repeatable(
          zu
            .array(zu.nativeEnum(ShowActivityField))
            .min(1, "Veuillez choisir un domaine d’activité"),
        ),
        logo: zu
          .instanceof(File, { message: "Veuillez choisir un logo" })
          .refine(
            (file) => file.size <= IMAGE_SIZE_LIMIT_B,
            `Le logo doit faire moins de ${IMAGE_SIZE_LIMIT_MB} MB`,
          ),
      })
      .and(
        zu.discriminatedUnion(
          "legalStatus",
          [
            zu.object({
              legalStatus: zu.nativeEnum(ShowExhibitorApplicationLegalStatus),
              otherLegalStatus: zu.undefined(),
            }),
            zu.object({
              legalStatus: zu.literal(OTHER_SHOW_LEGAL_STATUS),
              otherLegalStatus: zu
                .string({
                  required_error: "Veuillez entrer une forme juridique",
                })
                .trim()
                .min(1, "Veuillez entrer une forme juridique")
                .max(64, "Veuillez entrer une forme juridique plus courte"),
            }),
          ],
          {
            // When `legalStatus` is not defined, the issue is a
            // "invalid_union_discriminator" and its message can only be
            // customized using `errorMap`.
            errorMap: (issue, context) => {
              if (issue.code === zu.ZodIssueCode.invalid_union_discriminator) {
                return { message: "Veuillez choisir une forme juridique" };
              }

              return { message: context.defaultError };
            },
          },
        ),
      ),

    billing: zu.discriminatedUnion("sameAsStructure", [
      zu.object({
        // Conform doesn't coerse `zu.literal(true)`.
        sameAsStructure: zu.literal("on"),
        address: zu.undefined(),
        zipCode: zu.undefined(),
        city: zu.undefined(),
        country: zu.undefined(),
      }),
      zu.object({
        sameAsStructure: zu.literal("off").optional(),
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
      }),
    ]),

    participation: zu.object({
      desiredStandSize: zu.nativeEnum(ShowStandSize, {
        required_error: "Veuillez choisir une taille de stand",
      }),

      proposalForOnStageEntertainment: zu.preprocess(
        normalizeLineBreaks,
        zu
          .string()
          .trim()
          .max(512, "Veuillez entrer un text plus court")
          .optional(),
      ),
    }),

    partnershipCategory: zu.union(
      [
        zu.nativeEnum(ShowPartnershipCategory),
        zu.nativeEnum(ShowExhibitorApplicationOtherPartnershipCategory),
      ],
      { required_error: "Veuillez choisir une option" },
    ),

    comments: zu.object({
      motivation: zu.preprocess(
        normalizeLineBreaks,
        zu
          .string({ required_error: "Veuillez entrer une réponse" })
          .trim()
          .min(1, "Veuillez entrer une réponse")
          .max(1000, "Veuillez entrer une réponse plus courte"),
      ),

      discoverySource: zu
        .string({ required_error: "Veuillez entrer une réponse" })
        .trim()
        .min(1, "Veuillez entrer une réponse")
        .max(128, "Veuillez entrer une réponse plus courte"),

      comments: zu.preprocess(
        normalizeLineBreaks,
        zu
          .string()
          .trim()
          .max(512, "Veuillez entrer un commentaire plus court")
          .optional(),
      ),
    }),
  })
  .refine(
    (value) => {
      const hasLimitedStandSize = value.structure.activityFields.some(
        (activityField) =>
          SMALL_SIZED_STANDS_ACTIVITY_FIELDS.includes(activityField),
      );

      return (
        !hasLimitedStandSize ||
        !isLargeStandSize(value.participation.desiredStandSize)
      );
    },
    {
      message: "Veuillez choisir une taille de stand",
      path: ["participation", "desiredStandSize"],
    },
  );
