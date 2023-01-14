import { ActionArgs, json, MetaFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { actionClassName } from "~/core/actions";
import { cn } from "~/core/classNames";
import { Adornment } from "~/core/formElements/adornment";
import { formClassNames } from "~/core/formElements/form";
import { FormErrors } from "~/core/formElements/formErrors";
import { PasswordInput } from "~/core/formElements/passwordInput";
import { Card, CardContent, CardHeader, CardTitle } from "~/core/layout/card";
import { PageContent, PageLayout } from "~/core/layout/page";
import { useBackIfPossible } from "~/core/navigation";
import { getPageTitle } from "~/core/pageTitle";
import { createActionData } from "~/core/schemas";
import {
  getCurrentUser,
  updateCurrentUserPassword,
} from "~/currentUser/db.server";
import { Icon } from "~/generated/icon";

export const meta: MetaFunction = () => {
  return { title: getPageTitle("Changer de mot de passe") };
};

const ActionFormData = createActionData(
  z.object({
    password: z.string().min(1, "Veuillez entrer un mot de passe"),
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

  await updateCurrentUserPassword(currentUser.id, formData.data.password);

  return json<ActionData>({ redirectTo: "/me" });
}

export default function EditCurrentUserPasswordPage() {
  const fetcher = useFetcher<typeof action>();
  useBackIfPossible({ fallbackRedirectTo: fetcher.data?.redirectTo });

  const passwordRef = useRef<HTMLInputElement>(null);

  // Focus the field if it has an error.
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
    <PageLayout>
      <PageContent className="flex flex-col items-center">
        <Card className="w-full md:max-w-[600px]">
          <CardHeader>
            <CardTitle>Changer de mot de passe</CardTitle>
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
                    htmlFor={ActionFormData.keys.password}
                    className={formClassNames.fields.field.label()}
                  >
                    Nouveau mot de passe
                  </label>

                  <PasswordInput
                    autoFocus
                    ref={passwordRef}
                    id={ActionFormData.keys.password}
                    name={ActionFormData.keys.password}
                    autoComplete="new-password"
                    hasError={
                      fetcher.data?.errors?.fieldErrors.password != null
                    }
                    aria-describedby="password-error"
                    leftAdornment={
                      <Adornment>
                        <Icon id="lock" />
                      </Adornment>
                    }
                  />

                  {fetcher.data?.errors?.fieldErrors.password != null ? (
                    <p
                      id="password-error"
                      className={formClassNames.fields.field.errorMessage()}
                    >
                      {fetcher.data.errors.fieldErrors.password}
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
