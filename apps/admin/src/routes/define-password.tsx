import {
  ActionArgs,
  json,
  LoaderArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { actionClassName } from "~/core/actions";
import { InlineHelper } from "~/core/dataDisplay/helper";
import { Adornment } from "~/core/formElements/adornment";
import { formClassNames } from "~/core/formElements/form";
import { FormErrors } from "~/core/formElements/formErrors";
import { PasswordInput } from "~/core/formElements/passwordInput";
import { RouteHandle } from "~/core/handles";
import { getPageTitle } from "~/core/pageTitle";
import { createActionData } from "~/core/schemas";
import { NextSearchParams } from "~/core/searchParams";
import {
  getCurrentUser,
  updateCurrentUserPassword,
} from "~/currentUser/db.server";
import { Icon } from "~/generated/icon";
import nameAndLogo from "~/images/nameAndLogo.svg";

export const handle: RouteHandle = {
  htmlBackgroundColor: "bg-white",
};

export async function loader({ request }: LoaderArgs) {
  const currentUser = await getCurrentUser(
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

export const meta: MetaFunction = () => {
  return { title: getPageTitle("Définir un mot de passe") };
};

const ActionFormData = createActionData(
  z.object({
    password: z.string().min(1, "Veuillez entrer un mot de passe"),
  })
);

export async function action({ request }: ActionArgs) {
  const currentUser = await getCurrentUser(
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

  await updateCurrentUserPassword(currentUser.id, formData.data.password);

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
            method="post"
            noValidate
            className="flex flex-col gap-4"
          >
            <div className={formClassNames.fields.root()}>
              <InlineHelper variant="info">
                Pour plus de sécurité, veuillez définir un nouveau mot de passe.
              </InlineHelper>

              <FormErrors errors={fetcher.data?.errors.formErrors} />

              <div className={formClassNames.fields.field.root()}>
                <label
                  htmlFor={ActionFormData.keys.password}
                  className={formClassNames.fields.field.label()}
                >
                  Nouveau mot de passe
                </label>

                <PasswordInput
                  ref={passwordRef}
                  id={ActionFormData.keys.password}
                  name={ActionFormData.keys.password}
                  autoComplete="current-password"
                  hasError={fetcher.data?.errors.fieldErrors.password != null}
                  aria-describedby="password-error"
                  leftAdornment={
                    <Adornment>
                      <Icon id="lock" />
                    </Adornment>
                  }
                />

                {fetcher.data?.errors.fieldErrors.password != null ? (
                  <p
                    id="password-error"
                    className={formClassNames.fields.field.errorMessage()}
                  >
                    {fetcher.data?.errors.fieldErrors.password}
                  </p>
                ) : null}
              </div>
            </div>

            <button type="submit" className={actionClassName.standalone()}>
              Enregistrer
            </button>
          </fetcher.Form>
        </section>
      </section>
    </main>
  );
}
