import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { actionClassName } from "~/core/action";
import { createUserSession, getCurrentUser } from "~/core/currentUser.server";
import { Helper } from "~/core/dataDisplay/helper";
import { prisma } from "~/core/db.server";
import { Adornment } from "~/core/formElements/adornment";
import { formClassNames } from "~/core/formElements/form";
import { Input } from "~/core/formElements/input";
import { PasswordInput } from "~/core/formElements/passwordInput";
import { RouteHandle } from "~/core/handles";
import { joinReactNodes } from "~/core/joinReactNodes";
import { getPageTitle } from "~/core/pageTitle";
import { getNext, NextParamInput } from "~/core/params";
import { isSamePassword } from "~/core/password.server";
import { Icon } from "~/generated/icon";
import nameAndLogo from "~/images/nameAndLogo.svg";

export const handle: RouteHandle = {
  htmlBackgroundColor: "bg-white",
};

export const loader: LoaderFunction = async ({ request }) => {
  let hasCurrentUser: boolean;
  try {
    await getCurrentUser(request, { select: {} });
    hasCurrentUser = true;
  } catch (error) {
    hasCurrentUser = false;
  }

  if (hasCurrentUser) {
    const next = getNext(new URL(request.url).searchParams);
    throw redirect(next);
  }

  return null;
};

const ActionDataSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(1, { message: "Mot de passe obligatoire" }),
});

type ActionData = {
  errors?: z.inferFlattenedErrors<typeof ActionDataSchema>;
};

export const action: ActionFunction = async ({ request }) => {
  const rawFormData = await request.formData();
  const formData = ActionDataSchema.safeParse(
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

  return redirect(getNext(rawFormData), {
    headers: { "Set-Cookie": await createUserSession(userId) },
  });
};

async function verifyLogin({
  email,
  password,
}: z.infer<typeof ActionDataSchema>) {
  const user = await prisma.user.findFirst({
    where: { email, isDisabled: false },
    select: { id: true, password: true },
  });

  if (user?.password == null) {
    // Prevent finding out which emails exists through a timing attack.
    // We want to take approximately the same time to respond so we fake a
    // password comparison.
    await isSamePassword(
      "Hello there",
      // "Obiwan Kenobi?"
      "879d5935bab9b03280188c1806cf5ae751579b3342c51e788c43be14e0109ab8b98da03f5fa2cc96c85ca192eda9aaf892cba7ba1fc3b7d1a4a1eb8956a65c53.6a71cc1003ad30a5c6abf0d53baa2c5d"
    );

    return null;
  }

  if (!(await isSamePassword(password, user.password.hash))) {
    return null;
  }

  return user.id;
}

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<ActionData>();
  const { formErrors = [], fieldErrors = {} } = actionData?.errors ?? {};

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Focus the first field having an error.
  useEffect(() => {
    if (actionData?.errors != null) {
      if (actionData.errors.fieldErrors.email != null) {
        emailRef.current?.focus();
      } else if (actionData.errors.fieldErrors.password != null) {
        passwordRef.current?.focus();
      }
    }
  }, [actionData]);

  return (
    <main className="w-full grid grid-cols-[minmax(0px,500px)] auto-rows-auto justify-center justify-items-center md:min-h-screen md:grid-cols-[1fr_minmax(500px,1fr)]">
      <section className="hidden w-full bg-blue-500 md:block" />

      <section className="w-full max-w-[500px] p-safe-2 grid grid-cols-1 auto-rows-auto content-start gap-4 md:pl-4 md:pr-safe-4 md:py-safe-4">
        <img
          src={nameAndLogo}
          alt={getPageTitle()}
          className="self-start h-3 md:h-4"
        />

        <h1 className="text-title-hero-small md:mt-[10vh] md:text-title-hero-large">
          Bienvenue
        </h1>

        <Form
          method="post"
          noValidate
          className="grid grid-cols-1 auto-rows-auto gap-3"
        >
          {formErrors.length > 0 && (
            <Helper id="form-errors">
              {joinReactNodes(formErrors, <br />)}
            </Helper>
          )}

          <div className={formClassNames.fields.root()}>
            <div className={formClassNames.fields.field.root()}>
              <label
                htmlFor="email"
                className={formClassNames.fields.field.label()}
              >
                Email
              </label>

              <Input
                autoFocus
                ref={emailRef}
                id="email"
                type="email"
                name="email"
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

              {fieldErrors.email != null && (
                <p
                  id="email-error"
                  className={formClassNames.fields.field.errorMessage()}
                >
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className={formClassNames.fields.field.root()}>
              <label
                htmlFor="password"
                className={formClassNames.fields.field.label()}
              >
                Mot de passe
              </label>

              <PasswordInput
                ref={passwordRef}
                id="password"
                name="password"
                autoComplete="current-password"
                hasError={fieldErrors.password != null}
                aria-describedby="password-error"
                leftAdornment={
                  <Adornment>
                    <Icon id="lock" />
                  </Adornment>
                }
              />

              {fieldErrors.password != null && (
                <p
                  id="password-error"
                  className={formClassNames.fields.field.errorMessage()}
                >
                  {fieldErrors.password}
                </p>
              )}
            </div>
          </div>

          <NextParamInput value={getNext(searchParams)} />

          <button type="submit" className={actionClassName()}>
            Se connecter
          </button>
        </Form>
      </section>
    </main>
  );
}
