import {
  ActionArgs,
  json,
  LoaderArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { createPath } from "history";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { actionClassName } from "~/core/actions";
import { cn } from "~/core/classNames";
import { Adornment } from "~/core/formElements/adornment";
import { formClassNames } from "~/core/formElements/form";
import { FormErrors } from "~/core/formElements/formErrors";
import { Input } from "~/core/formElements/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/core/layout/card";
import { getPageTitle } from "~/core/pageTitle";
import { createActionData } from "~/core/schemas";
import {
  ActionConfirmationSearchParams,
  ActionConfirmationType,
} from "~/core/searchParams";
import {
  EmailAlreadyUsedError,
  getCurrentUser,
  updateCurrentUserProfile,
} from "~/currentUser/db.server";
import { Icon } from "~/generated/icon";

export async function loader({ request }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: {
      displayName: true,
      email: true,
    },
  });

  return json({ currentUser });
}

export const meta: MetaFunction = () => {
  return { title: getPageTitle("Modifier votre profil") };
};

const ActionFormData = createActionData(
  z.object({
    name: z.string().min(1, "Veuillez entrer un nom"),
    email: z.string().email("Veuillez entrer un email valide"),
  })
);

type ActionData = {
  errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request }: ActionArgs) {
  const currentUser = await getCurrentUser(request, { select: { id: true } });

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

  try {
    await updateCurrentUserProfile(currentUser.id, {
      displayName: formData.data.name,
      email: formData.data.email,
    });
  } catch (error) {
    if (error instanceof EmailAlreadyUsedError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: [],
            fieldErrors: { email: ["L’email est déjà utilisé."] },
          },
        },
        { status: 400 }
      );
    }

    throw error;
  }

  throw redirect(
    createPath({
      pathname: "/me",
      search: new ActionConfirmationSearchParams()
        .setConfirmation(ActionConfirmationType.EDIT)
        .toString(),
    })
  );
}

export default function EditCurrentUserProfilePage() {
  const { currentUser } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { formErrors = [], fieldErrors = {} } = actionData?.errors ?? {};

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // Focus the first field having an error.
  useEffect(() => {
    if (actionData?.errors != null) {
      if (actionData.errors.formErrors.length > 0) {
        window.scrollTo({ top: 0 });
      } else if (actionData.errors.fieldErrors.name != null) {
        nameRef.current?.focus();
      } else if (actionData.errors.fieldErrors.email != null) {
        emailRef.current?.focus();
      }
    }
  }, [actionData]);

  return (
    <main className="w-full flex flex-col md:max-w-[600px]">
      <Card>
        <CardHeader>
          <CardTitle>Modifier votre profil</CardTitle>
        </CardHeader>

        <CardContent>
          <Form
            method="post"
            noValidate
            className={formClassNames.root({ hasHeader: true })}
          >
            <div className={formClassNames.fields.root()}>
              <FormErrors errors={formErrors} />

              <div className={formClassNames.fields.field.root()}>
                <label
                  htmlFor={ActionFormData.keys.name}
                  className={formClassNames.fields.field.label()}
                >
                  Nom
                </label>

                <Input
                  autoFocus
                  ref={nameRef}
                  id={ActionFormData.keys.name}
                  type="text"
                  name={ActionFormData.keys.name}
                  autoComplete="name"
                  defaultValue={currentUser.displayName}
                  hasError={fieldErrors.name != null}
                  aria-describedby="name-error"
                  leftAdornment={
                    <Adornment>
                      <Icon id="user" />
                    </Adornment>
                  }
                />

                {fieldErrors.name != null && (
                  <p
                    id="name-error"
                    className={formClassNames.fields.field.errorMessage()}
                  >
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div className={formClassNames.fields.field.root()}>
                <label
                  htmlFor={ActionFormData.keys.email}
                  className={formClassNames.fields.field.label()}
                >
                  Email
                </label>

                <Input
                  ref={emailRef}
                  id={ActionFormData.keys.email}
                  type="email"
                  name={ActionFormData.keys.email}
                  autoComplete="email"
                  defaultValue={currentUser.email}
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
            </div>

            <button
              type="submit"
              className={cn(actionClassName.standalone(), "w-full md:w-auto")}
            >
              Enregistrer
            </button>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
