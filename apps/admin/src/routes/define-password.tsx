import { ActionArgs, json, LoaderArgs, redirect } from "@remix-run/node";
import { useFetcher, V2_MetaFunction } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { createActionData } from "~/core/actionData";
import { Action } from "~/core/actions";
import { InlineHelper } from "~/core/dataDisplay/helper";
import { db } from "~/core/db.server";
import { Form } from "~/core/formElements/form";
import { PasswordInput } from "~/core/formElements/passwordInput";
import { RouteHandle } from "~/core/handles";
import { getPageTitle } from "~/core/pageTitle";
import { NextSearchParams } from "~/core/searchParams";
import { Icon } from "~/generated/icon";
import nameAndLogo from "~/images/nameAndLogo.svg";

export const handle: RouteHandle = {
  htmlBackgroundColor: "bg-white",
};

export async function loader({ request }: LoaderArgs) {
  const currentUser = await db.currentUser.get(
    request,
    { select: { shouldChangePassword: true } },
    { skipPasswordChangeCheck: true }
  );

  if (!currentUser.shouldChangePassword) {
    const url = new URL(request.url);
    const searchParams = new NextSearchParams(url.searchParams);
    throw redirect(searchParams.getNextOrDefault());
  }

  return null;
}

export const meta: V2_MetaFunction = () => {
  return [{ title: getPageTitle("Définir un mot de passe") }];
};

const ActionFormData = createActionData(
  z.object({
    password: z.string().min(1, "Veuillez entrer un mot de passe"),
  })
);

export async function action({ request }: ActionArgs) {
  const currentUser = await db.currentUser.get(
    request,
    { select: { id: true } },
    { skipPasswordChangeCheck: true }
  );

  const rawFormData = await request.formData();
  const formData = ActionFormData.schema.safeParse(
    Object.fromEntries(rawFormData.entries())
  );

  if (!formData.success) {
    return json({ errors: formData.error.flatten() }, { status: 400 });
  }

  await db.currentUser.updatePassword(currentUser.id, formData.data.password);

  const url = new URL(request.url);
  const searchParams = new NextSearchParams(url.searchParams);
  throw redirect(searchParams.getNextOrDefault());
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
