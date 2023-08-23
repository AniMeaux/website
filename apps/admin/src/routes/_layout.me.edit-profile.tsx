import { createActionData } from "#core/actionData.tsx";
import { Action } from "#core/actions.tsx";
import { db } from "#core/db.server.ts";
import { EmailAlreadyUsedError } from "#core/errors.server.ts";
import { Form } from "#core/formElements/form.tsx";
import { Input } from "#core/formElements/input.tsx";
import { Card } from "#core/layout/card.tsx";
import { PageLayout } from "#core/layout/page.tsx";
import { Routes, useBackIfPossible } from "#core/navigation.ts";
import { getPageTitle } from "#core/pageTitle.ts";
import { Icon } from "#generated/icon.tsx";
import { ActionArgs, LoaderArgs, json } from "@remix-run/node";
import { V2_MetaFunction, useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";

export async function loader({ request }: LoaderArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: {
      displayName: true,
      email: true,
    },
  });

  return json({ currentUser });
}

export const meta: V2_MetaFunction = () => {
  return [{ title: getPageTitle("Modifier votre profil") }];
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
  const currentUser = await db.currentUser.get(request, {
    select: { id: true },
  });

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
    await db.currentUser.updateProfile(currentUser.id, {
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

  return json<ActionData>({ redirectTo: Routes.me.toString() });
}

export default function Route() {
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
      <PageLayout.Content className="flex flex-col items-center">
        <Card className="w-full md:max-w-[600px]">
          <Card.Header>
            <Card.Title>Modifier votre profil</Card.Title>
          </Card.Header>

          <Card.Content>
            <Form asChild hasHeader>
              <fetcher.Form method="POST" noValidate>
                <Form.Fields>
                  <Form.Errors errors={fetcher.data?.errors?.formErrors} />

                  <Form.Field>
                    <Form.Label htmlFor={ActionFormData.keys.name}>
                      Nom
                    </Form.Label>

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
                        <Input.Adornment>
                          <Icon id="user" />
                        </Input.Adornment>
                      }
                    />

                    {fetcher.data?.errors?.fieldErrors.name != null ? (
                      <Form.ErrorMessage id="name-error">
                        {fetcher.data.errors.fieldErrors.name}
                      </Form.ErrorMessage>
                    ) : null}
                  </Form.Field>

                  <Form.Field>
                    <Form.Label htmlFor={ActionFormData.keys.email}>
                      Email
                    </Form.Label>

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
                        <Input.Adornment>
                          <Icon id="envelope" />
                        </Input.Adornment>
                      }
                    />

                    {fetcher.data?.errors?.fieldErrors.email != null ? (
                      <Form.ErrorMessage id="email-error">
                        {fetcher.data.errors.fieldErrors.email}
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
