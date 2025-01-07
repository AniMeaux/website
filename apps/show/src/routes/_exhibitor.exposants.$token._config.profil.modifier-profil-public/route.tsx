import { cloudinary } from "#core/cloudinary/cloudinary.server";
import { getErrorTitle } from "#core/data-display/error-page";
import { email } from "#core/emails.server";
import { FormLayout } from "#core/layout/form-layout";
import { createSocialMeta } from "#core/meta";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { badRequest } from "#core/response.server";
import { services } from "#core/services/services.server";
import { canEditProfile } from "#exhibitors/profile/dates";
import { createEmailTemplatePublicProfileUpdated } from "#exhibitors/profile/email.server";
import { RouteParamsSchema } from "#exhibitors/route-params";
import { parseWithZod } from "@conform-to/zod";
import { parseFormData } from "@mjackson/form-data-parser";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { createPath } from "@remix-run/react";
import { captureException } from "@sentry/remix";
import { v4 as uuid } from "uuid";
import { ActionSchema } from "./action";
import { SectionForm } from "./section-form";
import { SectionHelper } from "./section-helper";

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = RouteParamsSchema.parse(params);

  if (!canEditProfile()) {
    throw redirect(
      createPath({
        pathname: Routes.exhibitors.token(routeParams.token).profile.toString(),
      }),
    );
  }

  const profile = await services.exhibitor.profile.getByToken(
    routeParams.token,
    {
      select: {
        updatedAt: true,
        activityFields: true,
        activityTargets: true,
        links: true,
        logoPath: true,
        name: true,
      },
    },
  );

  return { profile };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null
        ? ["Modifier le profil public", data.profile.name]
        : getErrorTitle(404),
    ),
  });
};

export async function action({ request, params }: ActionFunctionArgs) {
  const routeParams = RouteParamsSchema.parse(params);

  if (!canEditProfile()) {
    throw badRequest();
  }

  const reversibleUpload = cloudinary.reversibleUpload.create();

  async function revertUpload() {
    const errors = await reversibleUpload.revert();

    if (errors != null) {
      captureException(new Error("Could not delete exhibitor profile logo"), {
        extra: {
          errors: errors.map(({ error, ...rest }) => ({
            ...rest,
            error: error instanceof Error ? error.message : String(error),
          })),
        },
      });
    }
  }

  const formData = await parseFormData(request, async (fileUpload) => {
    if (fileUpload.fieldName !== "logo" || fileUpload.name === "") {
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

  try {
    await services.exhibitor.profile.update(routeParams.token, {
      activityTargets: submission.value.activityTargets,
      activityFields: submission.value.activityFields,
      links: submission.value.links,
      logoPath: submission.value.logo?.name,
    });
  } catch (error) {
    await revertUpload();

    throw error;
  }

  email.send.template(
    createEmailTemplatePublicProfileUpdated(routeParams.token),
  );

  throw redirect(
    createPath({
      pathname: Routes.exhibitors.token(routeParams.token).profile.toString(),
    }),
  );
}

export default function Route() {
  return (
    <FormLayout.Root className="py-4 px-safe-page-narrow md:px-safe-page-normal">
      <SectionForm />
      <SectionHelper />
    </FormLayout.Root>
  );
}
