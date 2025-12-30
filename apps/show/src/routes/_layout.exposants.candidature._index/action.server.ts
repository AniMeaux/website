import { Routes } from "#i/core/navigation";
import { services } from "#i/core/services.server.js";
import { ServiceApplication } from "#i/exhibitors/application/service.server";
import { SponsorshipCategory } from "#i/exhibitors/sponsorship/category";
import { catchError } from "@animeaux/core";
import { parseWithZod } from "@conform-to/zod";
import { parseFormData } from "@mjackson/form-data-parser";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { captureException } from "@sentry/remix";
import { v4 as uuid } from "uuid";
import { createActionSchema } from "./action-schema";
import { getStandSizesData } from "./stand-sizes.server";

export async function action({ request }: ActionFunctionArgs) {
  const standSizes = await getStandSizesData();

  const availableStandSizes = standSizes.filter(
    (standSize) => standSize.isAvailable,
  );

  const reversibleUpload = services.image.createReversibleUpload();

  async function revertUpload() {
    const errors = await reversibleUpload.revert();

    if (errors != null) {
      captureException(
        new Error("Could not delete exhibitor application logo"),
        {
          extra: {
            errors: errors.map(({ error, ...rest }) => ({
              ...rest,
              error: error instanceof Error ? error.message : String(error),
            })),
          },
        },
      );
    }
  }

  const formData = await parseFormData(request, async (fileUpload) => {
    if (fileUpload.fieldName !== "structure.logo" || fileUpload.name === "") {
      return undefined;
    }

    try {
      return await reversibleUpload.upload(fileUpload, {
        imageId: `show/exhibitors-logo/${uuid()}`,
      });
    } catch (error) {
      captureException(error);

      return undefined;
    }
  });

  const submission = parseWithZod(formData, {
    schema: createActionSchema(availableStandSizes),
  });

  if (submission.status !== "success") {
    await revertUpload();

    return json(submission.reply(), { status: 400 });
  }

  const [error, application] = await catchError(() =>
    services.application.create({
      contactFirstname: submission.value.contact.firstname,
      contactLastname: submission.value.contact.lastname,
      contactEmail: submission.value.contact.email,
      contactPhone: submission.value.contact.phone,

      structureName: submission.value.structure.name,
      structureUrl: submission.value.structure.url,
      structureLegalStatus: submission.value.structure.legalStatus,
      structureLegalStatusOther: submission.value.structure.legalStatusOther,
      structureSiret: submission.value.structure.siret,
      structureAddress: submission.value.structure.address,
      structureZipCode: submission.value.structure.zipCode,
      structureCity: submission.value.structure.city,
      structureCountry: submission.value.structure.country,
      structureActivityDescription:
        submission.value.structure.activityDescription,
      structureActivityTargets: submission.value.structure.activityTargets,
      structureActivityFields: submission.value.structure.activityFields,
      structureLogoPath: submission.value.structure.logo.name,

      desiredStandSizeId: submission.value.participation.desiredStandSizeId,
      proposalForOnStageEntertainment:
        submission.value.participation.proposalForOnStageEntertainment,

      sponsorshipCategory: SponsorshipCategory.toDb(
        submission.value.sponsorshipCategory,
      ),

      motivation: submission.value.comments.motivation,

      discoverySource: submission.value.comments.discoverySource,
      discoverySourceOther: submission.value.comments.discoverySourceOther,

      comments: submission.value.comments.comments,
    }),
  );

  if (error != null) {
    await revertUpload();

    if (error instanceof ServiceApplication.EmailAlreadyUsedError) {
      return json(
        submission.reply({
          fieldErrors: {
            "contact.email": [
              "Une candidature existe déjà pour cette adresse e-mail",
            ],
          },
        }),
        { status: 400 },
      );
    }

    throw error;
  }

  services.applicationEmail.submitted(application);

  throw redirect(
    Routes.exhibitors.application.applicationId(application.id).toString(),
  );
}
