import { ActionArgs, json } from "@remix-run/node";
import { V2_MetaFunction, useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { Action } from "~/core/actions";
import { Form } from "~/core/formElements/form";
import { PasswordInput } from "~/core/formElements/passwordInput";
import { Card } from "~/core/layout/card";
import { PageLayout } from "~/core/layout/page";
import { useBackIfPossible } from "~/core/navigation";
import { getPageTitle } from "~/core/pageTitle";
import { createActionData } from "~/core/schemas";
import {
  getCurrentUser,
  updateCurrentUserPassword,
} from "~/currentUser/db.server";
import { Icon } from "~/generated/icon";

export const meta: V2_MetaFunction = () => {
  return [{ title: getPageTitle("Changer de mot de passe") }];
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

export default function Route() {
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
      <PageLayout.Content className="flex flex-col items-center">
        <Card className="w-full md:max-w-[600px]">
          <Card.Header>
            <Card.Title>Changer de mot de passe</Card.Title>
          </Card.Header>

          <Card.Content>
            <Form asChild hasHeader>
              <fetcher.Form method="POST" noValidate>
                <Form.Fields>
                  <Form.Errors errors={fetcher.data?.errors?.formErrors} />

                  <Form.Field>
                    <Form.Label htmlFor={ActionFormData.keys.password}>
                      Nouveau mot de passe
                    </Form.Label>

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

                <Form.Action asChild>
                  <Action>Enregistrer</Action>
                </Form.Action>
              </fetcher.Form>
            </Form>
          </Card.Content>
        </Card>
      </PageLayout.Content>
    </PageLayout>
  );
}
