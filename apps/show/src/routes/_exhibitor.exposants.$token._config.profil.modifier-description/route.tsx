import { getErrorTitle } from "#core/data-display/error-page";
import { email } from "#core/emails.server";
import { FormLayout } from "#core/layout/form-layout";
import { createSocialMeta } from "#core/meta";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { badRequest } from "#core/response.server";
import { services } from "#core/services/services.server";
import { canEditProfile } from "#exhibitors/profile/dates";
import { createEmailTemplateDescriptionUpdated } from "#exhibitors/profile/email.server";
import { RouteParamsSchema } from "#exhibitors/route-params";
import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { ActionSchema } from "./action";
import { SectionForm } from "./section-form";
import { SectionHelper } from "./section-helper";

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = RouteParamsSchema.parse(params);

  if (!canEditProfile()) {
    throw redirect(
      Routes.exhibitors.token(routeParams.token).profile.toString(),
    );
  }

  const profile = await services.exhibitor.profile.getByToken(
    routeParams.token,
    { select: { description: true, name: true } },
  );

  return { profile };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null
        ? ["Modifier la description", data.profile.name]
        : getErrorTitle(404),
    ),
  });
};

export async function action({ request, params }: ActionFunctionArgs) {
  const routeParams = RouteParamsSchema.parse(params);

  if (!canEditProfile()) {
    throw badRequest();
  }

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: ActionSchema });

  if (submission.status !== "success") {
    return json(submission.reply(), { status: 400 });
  }

  await services.exhibitor.profile.update(routeParams.token, {
    description: submission.value.description || null,
  });

  email.send.template(createEmailTemplateDescriptionUpdated(routeParams.token));

  throw redirect(Routes.exhibitors.token(routeParams.token).profile.toString());
}

export default function Route() {
  return (
    <FormLayout.Root className="py-4 px-safe-page-narrow md:px-safe-page-normal">
      <SectionForm />
      <SectionHelper />
    </FormLayout.Root>
  );
}
