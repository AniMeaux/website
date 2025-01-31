import { Action } from "#core/actions";
import { db } from "#core/db.server";
import { Form } from "#core/form-elements/form";
import { Input } from "#core/form-elements/input";
import { PasswordInput } from "#core/form-elements/password-input";
import type { RouteHandle } from "#core/handles";
import { AuthPage } from "#core/layout/auth-page";
import { useCurrentUserForMonitoring } from "#core/monitoring.client";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { NextSearchParams } from "#core/search-params";
import { createCurrentUserSession } from "#current-user/session.server";
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
  let hasCurrentUser: boolean;
  try {
    await db.currentUser.get(
      request,
      { select: { id: true } },
      { skipPasswordChangeCheck: true },
    );
    hasCurrentUser = true;
  } catch (error) {
    hasCurrentUser = false;
  }

  if (hasCurrentUser) {
    const url = new URL(request.url);
    const { next = Routes.home.toString() } = NextSearchParams.parse(
      url.searchParams,
    );
    throw redirect(next);
  }

  return null;
}

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Connexion") }];
};

const ActionFormData = FormDataDelegate.create(
  zu.object({
    email: zu.string().email("Veuillez entrer un email valide"),
    password: zu.string().min(1, "Veuillez entrer un mot de passe"),
  }),
);

type ActionData = {
  errors?: zu.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = ActionFormData.safeParse(await request.formData());
  if (!formData.success) {
    return json<ActionData>(
      { errors: formData.error.flatten() },
      { status: 400 },
    );
  }

  const userId = await db.currentUser.verifyLogin(formData.data);
  if (userId == null) {
    return json<ActionData>(
      {
        errors: {
          formErrors: ["Identifiants invalides."],
          fieldErrors: {},
        },
      },
      { status: 400 },
    );
  }

  const url = new URL(request.url);
  const { next = Routes.home.toString() } = NextSearchParams.parse(
    url.searchParams,
  );
  throw redirect(next, {
    headers: { "Set-Cookie": await createCurrentUserSession(userId) },
  });
}

export default function Route() {
  useCurrentUserForMonitoring(null);

  const fetcher = useFetcher<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Focus the first field having an error.
  useEffect(() => {
    if (fetcher.data?.errors != null) {
      if (fetcher.data.errors.formErrors.length > 0) {
        window.scrollTo({ top: 0 });
      } else if (fetcher.data.errors.fieldErrors.email != null) {
        emailRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.password != null) {
        passwordRef.current?.focus();
      }
    }
  }, [fetcher.data?.errors]);

  return (
    <AuthPage.Main>
      <AuthPage.Title>Bienvenue</AuthPage.Title>

      <fetcher.Form method="POST" noValidate className="flex flex-col gap-4">
        <Form.Fields>
          <Form.Errors errors={fetcher.data?.errors?.formErrors} />

          <Form.Field>
            <Form.Label htmlFor={ActionFormData.keys.email}>Email</Form.Label>

            <Input
              autoFocus
              ref={emailRef}
              id={ActionFormData.keys.email}
              type="email"
              name={ActionFormData.keys.email}
              autoComplete="email"
              hasError={fetcher.data?.errors?.fieldErrors.email != null}
              aria-describedby="email-error"
              placeholder="jean@mail.com"
              leftAdornment={
                <Input.Adornment>
                  <Icon href="icon-envelope-solid" />
                </Input.Adornment>
              }
            />

            {fetcher.data?.errors?.fieldErrors.email != null ? (
              <Form.ErrorMessage id="email-error">
                {fetcher.data.errors.fieldErrors.email}
              </Form.ErrorMessage>
            ) : null}
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor={ActionFormData.keys.password}>
              Mot de passe
            </Form.Label>

            <PasswordInput
              ref={passwordRef}
              id={ActionFormData.keys.password}
              name={ActionFormData.keys.password}
              autoComplete="current-password"
              hasError={fetcher.data?.errors?.fieldErrors.password != null}
              aria-describedby="password-error"
              leftAdornment={
                <PasswordInput.Adornment>
                  <Icon href="icon-lock-solid" />
                </PasswordInput.Adornment>
              }
            />

            {fetcher.data?.errors?.fieldErrors.password != null ? (
              <Form.ErrorMessage id="password-error">
                {fetcher.data.errors.fieldErrors.password}
              </Form.ErrorMessage>
            ) : null}
          </Form.Field>
        </Form.Fields>

        <Action type="submit">Se connecter</Action>
      </fetcher.Form>
    </AuthPage.Main>
  );
}
