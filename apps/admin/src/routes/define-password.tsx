import { Action } from "#core/actions";
import { InlineHelper } from "#core/data-display/helper";
import { db } from "#core/db.server";
import { Form } from "#core/form-elements/form";
import { PasswordInput } from "#core/form-elements/password-input";
import type { RouteHandle } from "#core/handles";
import { AuthPage } from "#core/layout/auth-page";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { NextSearchParams } from "#core/search-params";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { FormDataDelegate } from "@animeaux/form-data";
import { zu } from "@animeaux/zod-utils";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";

export const handle: RouteHandle = {
  htmlBackgroundColor: cn("bg-white"),
};

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(
    request,
    { select: { shouldChangePassword: true } },
    { skipPasswordChangeCheck: true },
  );

  if (!currentUser.shouldChangePassword) {
    const url = new URL(request.url);
    const { next = Routes.home.toString() } = NextSearchParams.parse(
      url.searchParams,
    );
    throw redirect(next);
  }

  return null;
}

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Définir un mot de passe") }];
};

const ActionFormData = FormDataDelegate.create(
  zu.object({
    password: zu.string().min(1, "Veuillez entrer un mot de passe"),
  }),
);

export async function action({ request }: ActionFunctionArgs) {
  const currentUser = await db.currentUser.get(
    request,
    { select: { id: true } },
    { skipPasswordChangeCheck: true },
  );

  const formData = ActionFormData.safeParse(await request.formData());
  if (!formData.success) {
    return json({ errors: formData.error.flatten() }, { status: 400 });
  }

  await db.currentUser.updatePassword(currentUser.id, formData.data.password);

  const url = new URL(request.url);
  const { next = Routes.home.toString() } = NextSearchParams.parse(
    url.searchParams,
  );
  throw redirect(next);
}

export default function Route() {
  const fetcher = useFetcher<typeof action>();
  const passwordRef = useRef<HTMLInputElement>(null);

  // Focus the first field having an error.
  useEffect(() => {
    if (fetcher.data?.errors != null) {
      if (fetcher.data.errors.formErrors.length > 0) {
        window.scrollTo({ top: 0 });
      } else if (fetcher.data.errors.fieldErrors.password != null) {
        passwordRef.current?.focus();
      }
    }
  }, [fetcher.data?.errors]);

  return (
    <AuthPage.Main>
      <AuthPage.Title>Définir un mot de passe</AuthPage.Title>

      <fetcher.Form method="POST" noValidate className="flex flex-col gap-4">
        <Form.Fields>
          <InlineHelper variant="info">
            Pour plus de sécurité, veuillez définir un nouveau mot de passe.
          </InlineHelper>

          <Form.Errors errors={fetcher.data?.errors.formErrors} />

          <Form.Field>
            <Form.Label htmlFor={ActionFormData.keys.password}>
              Nouveau mot de passe
            </Form.Label>

            <PasswordInput
              ref={passwordRef}
              id={ActionFormData.keys.password}
              name={ActionFormData.keys.password}
              autoComplete="current-password"
              hasError={fetcher.data?.errors.fieldErrors.password != null}
              aria-describedby="password-error"
              leftAdornment={
                <PasswordInput.Adornment>
                  <Icon href="icon-lock" />
                </PasswordInput.Adornment>
              }
            />

            {fetcher.data?.errors.fieldErrors.password != null ? (
              <Form.ErrorMessage id="password-error">
                {fetcher.data?.errors.fieldErrors.password}
              </Form.ErrorMessage>
            ) : null}
          </Form.Field>
        </Form.Fields>

        <Action type="submit">Enregistrer</Action>
      </fetcher.Form>
    </AuthPage.Main>
  );
}
