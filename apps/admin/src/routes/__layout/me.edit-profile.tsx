import { ActionArgs, json, LoaderArgs, MetaFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { actionClassName } from "~/core/actions";
import { cn } from "~/core/classNames";
import { EmailAlreadyUsedError } from "~/core/errors.server";
import { Adornment } from "~/core/formElements/adornment";
import { formClassNames } from "~/core/formElements/form";
import { FormErrors } from "~/core/formElements/formErrors";
import { Input } from "~/core/formElements/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/core/layout/card";
import { PageContent, PageLayout } from "~/core/layout/page";
import { useBackIfPossible } from "~/core/navigation";
import { getPageTitle } from "~/core/pageTitle";
import { createActionData } from "~/core/schemas";
import {
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
  redirectTo?: string;
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
            fieldErrors: { email: ["L’email est déjà utilisé"] },
          },
        },
        { status: 400 }
      );
    }

    throw error;
  }

  return json<ActionData>({ redirectTo: "/me" });
}

export default function EditCurrentUserProfilePage() {
  const { currentUser } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  useBackIfPossible({ fallbackRedirectTo: fetcher.data?.redirectTo });

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // Focus the first field having an error.
  useEffect(() => {
    if (fetcher.data?.errors != null) {
      if (fetcher.data.errors.formErrors.length > 0) {
        window.scrollTo({ top: 0 });
      } else if (fetcher.data.errors.fieldErrors.name != null) {
        nameRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.email != null) {
        emailRef.current?.focus();
      }
    }
  }, [fetcher.data?.errors]);

  return (
    <PageLayout>
      <PageContent className="flex flex-col items-center">
        <Card className="w-full md:max-w-[600px]">
          <CardHeader>
            <CardTitle>Modifier votre profil</CardTitle>
          </CardHeader>

          <CardContent>
            <fetcher.Form
              method="post"
              noValidate
              className={formClassNames.root({ hasHeader: true })}
            >
              <div className={formClassNames.fields.root()}>
                <FormErrors errors={fetcher.data?.errors?.formErrors} />

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
                    hasError={fetcher.data?.errors?.fieldErrors.name != null}
                    aria-describedby="name-error"
                    leftAdornment={
                      <Adornment>
                        <Icon id="user" />
                      </Adornment>
                    }
                  />

                  {fetcher.data?.errors?.fieldErrors.name != null ? (
                    <p
                      id="name-error"
                      className={formClassNames.fields.field.errorMessage()}
                    >
                      {fetcher.data.errors.fieldErrors.name}
                    </p>
                  ) : null}
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
                    hasError={fetcher.data?.errors?.fieldErrors.email != null}
                    aria-describedby="email-error"
                    placeholder="jean@mail.com"
                    leftAdornment={
                      <Adornment>
                        <Icon id="envelope" />
                      </Adornment>
                    }
                  />

                  {fetcher.data?.errors?.fieldErrors.email != null ? (
                    <p
                      id="email-error"
                      className={formClassNames.fields.field.errorMessage()}
                    >
                      {fetcher.data.errors.fieldErrors.email}
                    </p>
                  ) : null}
                </div>
              </div>

              <button
                type="submit"
                className={cn(actionClassName.standalone(), "w-full md:w-auto")}
              >
                Enregistrer
              </button>
            </fetcher.Form>
          </CardContent>
        </Card>
      </PageContent>
    </PageLayout>
  );
}
