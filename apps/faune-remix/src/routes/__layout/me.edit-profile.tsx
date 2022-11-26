import { Prisma } from "@prisma/client";
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
import { actionClassName } from "~/core/action";
import { cn } from "~/core/classNames";
import { getCurrentUser } from "~/core/currentUser.server";
import { Helper } from "~/core/dataDisplay/helper";
import { prisma } from "~/core/db.server";
import { Adornment } from "~/core/formElements/adornment";
import { formClassNames } from "~/core/formElements/form";
import { Input } from "~/core/formElements/input";
import { joinReactNodes } from "~/core/joinReactNodes";
import { Card, CardContent, CardHeader, CardTitle } from "~/core/layout/card";
import { getPageTitle } from "~/core/pageTitle";
import {
  ActionConfirmationSearchParams,
  ActionConfirmationType,
} from "~/core/searchParams";
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

const ActionDataSchema = z.object({
  name: z.string().min(1, { message: "Veuillez entrer un nom" }),
  email: z.string().email({ message: "Veuillez entrer un email valide" }),
});

type ActionData = {
  errors?: z.inferFlattenedErrors<typeof ActionDataSchema>;
};

export async function action({ request }: ActionArgs) {
  const currentUser = await getCurrentUser(request, { select: { id: true } });

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

  try {
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { displayName: formData.data.name, email: formData.data.email },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Email already used.
      // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
      if (error.code === "P2002") {
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
    }

    throw error;
  }

  return redirect(
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
  const actionData = useActionData() as ActionData;
  const { formErrors = [], fieldErrors = {} } = actionData?.errors ?? {};

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // Focus the first field having an error.
  useEffect(() => {
    if (actionData?.errors != null) {
      if (actionData.errors.fieldErrors.name != null) {
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
              {formErrors.length > 0 && (
                <Helper variant="error">
                  {joinReactNodes(formErrors, <br />)}
                </Helper>
              )}

              <div className={formClassNames.fields.field.root()}>
                <label
                  htmlFor="name"
                  className={formClassNames.fields.field.label()}
                >
                  Nom
                </label>

                <Input
                  autoFocus
                  ref={nameRef}
                  id="name"
                  type="text"
                  name="name"
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
                  htmlFor="email"
                  className={formClassNames.fields.field.label()}
                >
                  Email
                </label>

                <Input
                  ref={emailRef}
                  id="email"
                  type="email"
                  name="email"
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
              className={cn(actionClassName(), "w-full md:w-auto")}
            >
              Enregistrer
            </button>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
