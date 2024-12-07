import { Action } from "#core/actions";
import { db } from "#core/db.server";
import { Form } from "#core/form-elements/form";
import { PasswordInput } from "#core/form-elements/password-input";
import { Card } from "#core/layout/card";
import { PageLayout } from "#core/layout/page";
import { Routes, useBackIfPossible } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { Icon } from "#generated/icon";
import { FormDataDelegate } from "@animeaux/form-data";
import { zu } from "@animeaux/zod-utils";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Changer de mot de passe") }];
};

const ActionFormData = FormDataDelegate.create(
  zu.object({
    password: zu.string().min(1, "Veuillez entrer un mot de passe"),
  }),
);

type ActionData = {
  redirectTo?: string;
  errors?: zu.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request }: ActionFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { id: true },
  });

  const formData = ActionFormData.safeParse(await request.formData());
  if (!formData.success) {
    return json<ActionData>(
      { errors: formData.error.flatten() },
      { status: 400 },
    );
  }

  await db.currentUser.updatePassword(currentUser.id, formData.data.password);

  return json<ActionData>({ redirectTo: Routes.me.toString() });
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
    <PageLayout.Root>
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
                          <Icon href="icon-lock" />
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
    </PageLayout.Root>
  );
}
