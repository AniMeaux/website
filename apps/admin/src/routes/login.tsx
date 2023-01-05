import {
  ActionArgs,
  json,
  LoaderArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { actionClassName } from "~/core/actions";
import { Adornment } from "~/core/formElements/adornment";
import { formClassNames } from "~/core/formElements/form";
import { FormErrors } from "~/core/formElements/formErrors";
import { Input } from "~/core/formElements/input";
import { PasswordInput } from "~/core/formElements/passwordInput";
import { RouteHandle } from "~/core/handles";
import { getPageTitle } from "~/core/pageTitle";
import { createActionData } from "~/core/schemas";
import { NextSearchParams } from "~/core/searchParams";
import { getCurrentUser, verifyLogin } from "~/currentUser/db.server";
import { createUserSession } from "~/currentUser/session.server";
import { Icon } from "~/generated/icon";
import nameAndLogo from "~/images/nameAndLogo.svg";

export const handle: RouteHandle = {
  htmlBackgroundColor: "bg-white",
};

export async function loader({ request }: LoaderArgs) {
  let hasCurrentUser: boolean;
  try {
    await getCurrentUser(
      request,
      { select: { id: true } },
      { skipPasswordChangeCheck: true }
    );
    hasCurrentUser = true;
  } catch (error) {
    hasCurrentUser = false;
  }

  if (hasCurrentUser) {
    const url = new URL(request.url);
    const searchParams = new NextSearchParams(url.searchParams);
    throw redirect(searchParams.getNext());
  }

  return null;
}

export const meta: MetaFunction = () => {
  return { title: getPageTitle("Connexion") };
};

const ActionFormData = createActionData(
  z.object({
    email: z.string().email("Veuillez entrer un email valide"),
    password: z.string().min(1, "Veuillez entrer un mot de passe"),
  })
);

type ActionData = {
  errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request }: ActionArgs) {
  const rawFormData = await request.formData();
  const formData = ActionFormData.schema.safeParse(
    Object.fromEntries(rawFormData.entries())
  );

  if (!formData.success) {
    return json<ActionData>(
      { errors: formData.error.flatten() },
      { status: 400 }
    );
  }

  const userId = await verifyLogin(formData.data);
  if (userId == null) {
    return json<ActionData>(
      {
        errors: {
          formErrors: ["Identifiants invalides."],
          fieldErrors: {},
        },
      },
      { status: 400 }
    );
  }

  const url = new URL(request.url);
  const searchParams = new NextSearchParams(url.searchParams);
  throw redirect(searchParams.getNext(), {
    headers: { "Set-Cookie": await createUserSession(userId) },
  });
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const { formErrors = [], fieldErrors = {} } = actionData?.errors ?? {};

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Focus the first field having an error.
  useEffect(() => {
    if (actionData?.errors != null) {
      if (actionData.errors.formErrors.length > 0) {
        window.scrollTo({ top: 0 });
      } else if (actionData.errors.fieldErrors.email != null) {
        emailRef.current?.focus();
      } else if (actionData.errors.fieldErrors.password != null) {
        passwordRef.current?.focus();
      }
    }
  }, [actionData]);

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

          <Form method="post" noValidate className="flex flex-col gap-4">
            <div className={formClassNames.fields.root()}>
              <FormErrors errors={formErrors} />

              <div className={formClassNames.fields.field.root()}>
                <label
                  htmlFor={ActionFormData.keys.email}
                  className={formClassNames.fields.field.label()}
                >
                  Email
                </label>

                <Input
                  autoFocus
                  ref={emailRef}
                  id={ActionFormData.keys.email}
                  type="email"
                  name={ActionFormData.keys.email}
                  autoComplete="email"
                  hasError={fieldErrors.email != null}
                  aria-describedby="email-error"
                  placeholder="jean@mail.com"
                  leftAdornment={
                    <Adornment>
                      <Icon id="envelope" />
                    </Adornment>
                  }
                />

                {fieldErrors.email != null ? (
                  <p
                    id="email-error"
                    className={formClassNames.fields.field.errorMessage()}
                  >
                    {fieldErrors.email}
                  </p>
                ) : null}
              </div>

              <div className={formClassNames.fields.field.root()}>
                <label
                  htmlFor={ActionFormData.keys.password}
                  className={formClassNames.fields.field.label()}
                >
                  Mot de passe
                </label>

                <PasswordInput
                  ref={passwordRef}
                  id={ActionFormData.keys.password}
                  name={ActionFormData.keys.password}
                  autoComplete="current-password"
                  hasError={fieldErrors.password != null}
                  aria-describedby="password-error"
                  leftAdornment={
                    <Adornment>
                      <Icon id="lock" />
                    </Adornment>
                  }
                />

                {fieldErrors.password != null ? (
                  <p
                    id="password-error"
                    className={formClassNames.fields.field.errorMessage()}
                  >
                    {fieldErrors.password}
                  </p>
                ) : null}
              </div>
            </div>

            <button type="submit" className={actionClassName.standalone()}>
              Se connecter
            </button>
          </Form>
        </section>
      </section>
    </main>
  );
}
