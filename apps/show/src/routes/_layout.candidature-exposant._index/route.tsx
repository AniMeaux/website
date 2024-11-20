import { cloudinary } from "#core/cloudinary/cloudinary.server";
import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { db } from "#core/db.server";
import { email } from "#core/emails.server";
import { createSocialMeta } from "#core/meta";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { notFound } from "#core/response.server";
import { ExhibitorApplicationDbDelegate } from "#exhibitor-application/db.server";
import { parseWithZod } from "@conform-to/zod";
import { parseFormData } from "@mjackson/form-data-parser";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { createPath } from "@remix-run/react";
import { captureException } from "@sentry/remix";
import { v4 as uuid } from "uuid";
import { ActionSchema } from "./action";
import { createEmailTemplateConfirmation } from "./email-confirmation.server";
import { OTHER_SHOW_LEGAL_STATUS } from "./legal-status";
import { isPartnershipCategory } from "./partnership-category";
import { SectionDescription } from "./section-description";
import { SectionForm } from "./section-form";
import { SectionTitle } from "./section-title";

export async function loader() {
  if (process.env.FEATURE_FLAG_SITE_ONLINE !== "true") {
    throw notFound();
  }

  return json("ok" as const);
}

export async function action({ request }: ActionFunctionArgs) {
  const reversibleUpload = cloudinary.reversibleUpload.create();

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
    if (fileUpload.fieldName !== "structure.logo") {
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

  const submission = parseWithZod(formData, { schema: ActionSchema });

  if (submission.status !== "success") {
    await revertUpload();

    return json(submission.reply(), { status: 400 });
  }

  let application: Awaited<ReturnType<typeof db.exhibitorApplication.create>>;

  try {
    application = await db.exhibitorApplication.create({
      contactFirstname: submission.value.contact.firstname,
      contactLastname: submission.value.contact.lastname,
      contactEmail: submission.value.contact.email,
      contactPhone: submission.value.contact.phone,

      structureName: submission.value.structure.name,
      structureUrl: submission.value.structure.url,
      structureLegalStatus:
        submission.value.structure.legalStatus === OTHER_SHOW_LEGAL_STATUS
          ? undefined
          : submission.value.structure.legalStatus,
      structureOtherLegalStatus: submission.value.structure.otherLegalStatus,
      structureSiret: submission.value.structure.siret,
      structureAddress: submission.value.structure.address,
      structureZipCode: submission.value.structure.zipCode,
      structureCity: submission.value.structure.city,
      structureCountry: submission.value.structure.country,
      structureActivityFields: submission.value.structure.activityFields,
      structureLogoPath: submission.value.structure.logo.name,

      billingAddress:
        submission.value.billing.address ?? submission.value.structure.address,
      billingZipCode:
        submission.value.billing.zipCode ?? submission.value.structure.zipCode,
      billingCity:
        submission.value.billing.city ?? submission.value.structure.city,
      billingCountry:
        submission.value.billing.country ?? submission.value.structure.country,

      desiredStandSize: submission.value.participation.desiredStandSize,
      proposalForOnStageEntertainment:
        submission.value.participation.proposalForOnStageEntertainment,

      partnershipCategory: isPartnershipCategory(
        submission.value.partnershipCategory,
      )
        ? submission.value.partnershipCategory
        : undefined,

      otherPartnershipCategory: !isPartnershipCategory(
        submission.value.partnershipCategory,
      )
        ? submission.value.partnershipCategory
        : undefined,

      discoverySource: submission.value.discoverySource,
    });
  } catch (error) {
    await revertUpload();

    if (error instanceof ExhibitorApplicationDbDelegate.EmailAlreadyUsedError) {
      return json(
        submission.reply({
          fieldErrors: {
            "contact.email": [
              "Une candidature existe déjà pour cette adresse email",
            ],
          },
        }),
        { status: 400 },
      );
    }

    throw error;
  }

  email.send.template(createEmailTemplateConfirmation(application));

  throw redirect(
    createPath({
      pathname: Routes.exhibitorApplication.confirmation
        .applicationId(application.id)
        .toString(),
    }),
  );
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data === "ok" ? "Candidature exposant" : getErrorTitle(404),
    ),
  });
};

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  return (
    <>
      <SectionTitle />
      <SectionDescription />
      <SectionForm />
    </>
  );
}
