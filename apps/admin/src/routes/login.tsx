import { Action } from "#core/actions.tsx";
import { db } from "#core/db.server.ts";
import { Form } from "#core/formElements/form.tsx";
import { Input } from "#core/formElements/input.tsx";
import { PasswordInput } from "#core/formElements/passwordInput.tsx";
import type { RouteHandle } from "#core/handles.ts";
import { Routes } from "#core/navigation.ts";
import { getPageTitle } from "#core/pageTitle.ts";
import { NextSearchParams } from "#core/searchParams.ts";
import { createCurrentUserSession } from "#currentUser/session.server.ts";
import { Icon } from "#generated/icon.tsx";
import nameAndLogo from "#images/nameAndLogo.svg";
import { createFormData } from "@animeaux/form-data";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";

export const handle: RouteHandle = {
  htmlBackgroundColor: "bg-white",
};

export async function loader({ request }: LoaderArgs) {
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

export const meta: V2_MetaFunction = () => {
  return [{ title: getPageTitle("Connexion") }];
};

const ActionFormData = createFormData(
  z.object({
    email: z.string().email("Veuillez entrer un email valide"),
    password: z.string().min(1, "Veuillez entrer un mot de passe"),
  }),
);

type ActionData = {
  errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request }: ActionArgs) {
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
    <main className="w-full grid grid-cols-[minmax(0px,500px)] justify-center justify-items-center md:min-h-screen md:grid-cols-[1fr_minmax(500px,1fr)]">
      <section className="hidden w-full bg-blue-500 md:block" />

      <section className="w-full max-w-[500px] p-safe-2 flex flex-col justify-start md:pl-4 md:pr-safe-4 md:py-safe-4">
        <img
          src={nameAndLogo}
          alt={getPageTitle()}
          className="self-start h-3 md:h-4"
        />

        <section className="mt-4 md:mt-[10vh] flex flex-col gap-2">
          <h1 className="text-title-hero-small md:text-title-hero-large">
            Bienvenue
          </h1>

          <fetcher.Form
            method="POST"
            noValidate
            className="flex flex-col gap-4"
          >
            <Form.Fields>
              <Form.Errors errors={fetcher.data?.errors?.formErrors} />

              <Form.Field>
                <Form.Label htmlFor={ActionFormData.keys.email}>
                  Email
                </Form.Label>

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
                      <Icon id="envelope" />
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
                      <Icon id="lock" />
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
        </section>
      </section>
    </main>
  );
}
