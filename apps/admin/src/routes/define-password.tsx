import { Action } from "#core/actions.tsx";
import { InlineHelper } from "#core/dataDisplay/helper.tsx";
import { db } from "#core/db.server.ts";
import { Form } from "#core/formElements/form.tsx";
import { PasswordInput } from "#core/formElements/passwordInput.tsx";
import type { RouteHandle } from "#core/handles.ts";
import { Routes } from "#core/navigation.ts";
import { getPageTitle } from "#core/pageTitle.ts";
import { NextSearchParams } from "#core/searchParams.ts";
import { Icon } from "#generated/icon.tsx";
import nameAndLogo from "#images/nameAndLogo.svg";
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
  htmlBackgroundColor: cn("bg-white bg-var-white"),
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
    <main className="grid w-full grid-cols-[minmax(0px,500px)] justify-center justify-items-center md:min-h-screen md:grid-cols-[1fr_minmax(500px,1fr)]">
      <section className="hidden w-full bg-blue-500 md:block" />

      <section className="flex w-full max-w-[500px] flex-col justify-start p-safe-2 md:pl-4 md:pr-safe-4 md:py-safe-4">
        <img
          src={nameAndLogo}
          alt={getPageTitle()}
          className="h-3 self-start md:h-4"
        />

        <section className="mt-4 flex flex-col gap-2 md:mt-[10vh]">
          <h1 className="text-title-hero-small md:text-title-hero-large">
            Définir un mot de passe
          </h1>

          <fetcher.Form
            method="POST"
            noValidate
            className="flex flex-col gap-4"
          >
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
                      <Icon id="lock" />
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
        </section>
      </section>
    </main>
  );
}
