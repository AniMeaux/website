import { ActionArgs, json, MetaFunction, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createPath } from "history";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { actionClassName } from "~/core/actions";
import { cn } from "~/core/classNames";
import { Adornment } from "~/core/formElements/adornment";
import { formClassNames } from "~/core/formElements/form";
import { FormErrors } from "~/core/formElements/formErrors";
import { PasswordInput } from "~/core/formElements/passwordInput";
import { Card, CardContent, CardHeader, CardTitle } from "~/core/layout/card";
import { getPageTitle } from "~/core/pageTitle";
import { createActionData } from "~/core/schemas";
import {
  ActionConfirmationSearchParams,
  ActionConfirmationType,
} from "~/core/searchParams";
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

export async function action({ request }: ActionArgs) {
  const currentUser = await getCurrentUser(request, { select: { id: true } });

  const rawFormData = await request.formData();
  const formData = ActionFormData.schema.safeParse(
    Object.fromEntries(rawFormData.entries())
  );

  if (!formData.success) {
    return json({ errors: formData.error.flatten() }, { status: 400 });
  }

  await updateCurrentUserPassword(currentUser.id, formData.data.password);

  throw redirect(
    createPath({
      pathname: "/me",
      search: new ActionConfirmationSearchParams()
        .setConfirmation(ActionConfirmationType.EDIT_PASSWORD)
        .toString(),
    })
  );
}

export default function EditCurrentUserPasswordPage() {
  const actionData = useActionData<typeof action>();
  const { formErrors = [], fieldErrors = {} } = actionData?.errors ?? {};

  const passwordRef = useRef<HTMLInputElement>(null);

  // Focus the field if it has an error.
  useEffect(() => {
    if (actionData?.errors != null) {
      if (actionData.errors.formErrors.length > 0) {
        window.scrollTo({ top: 0 });
      } else if (actionData.errors.fieldErrors.password != null) {
        passwordRef.current?.focus();
      }
    }
  }, [actionData]);

  return (
    <main className="w-full flex flex-col md:max-w-[600px]">
      <Card>
        <CardHeader>
          <CardTitle>Changer de mot de passe</CardTitle>
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
