import { Color } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { FetcherWithComponents } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { createActionData } from "~/core/actionData";
import { Action } from "~/core/actions";
import { Form } from "~/core/formElements/form";
import { Input } from "~/core/formElements/input";
import { RequiredStar } from "~/core/formElements/requiredStar";
import { Icon } from "~/generated/icon";

export const ActionFormData = createActionData(
  z.object({
    name: z.string().trim().min(1, "Veuillez entrer un nom"),
  })
);

export function ColorForm({
  defaultColor,
  fetcher,
}: {
  defaultColor?: SerializeFrom<Pick<Color, "name">>;
  fetcher: FetcherWithComponents<{
    errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
  }>;
}) {
  const isCreate = defaultColor == null;
  const nameRef = useRef<HTMLInputElement>(null);

  // Focus the first field having an error.
  useEffect(() => {
    if (fetcher.data?.errors != null) {
      if (fetcher.data.errors.formErrors.length > 0) {
        window.scrollTo({ top: 0 });
      } else if (fetcher.data.errors.fieldErrors.name != null) {
        nameRef.current?.focus();
      }
    }
  }, [fetcher.data?.errors]);

  return (
    <Form asChild hasHeader>
      <fetcher.Form method="POST" noValidate>
        <Form.Fields>
          <Form.Errors errors={fetcher.data?.errors?.formErrors} />

          <Form.Field>
            <Form.Label htmlFor={ActionFormData.keys.name}>
              Nom <RequiredStar />
            </Form.Label>

            <Input
              ref={nameRef}
              id={ActionFormData.keys.name}
              type="text"
              name={ActionFormData.keys.name}
              defaultValue={defaultColor?.name}
              hasError={fetcher.data?.errors?.fieldErrors.name != null}
              aria-describedby="name-error"
              leftAdornment={
                <Input.Adornment>
                  <Icon id="palette" />
                </Input.Adornment>
              }
            />

            {fetcher.data?.errors?.fieldErrors.name != null ? (
              <Form.ErrorMessage id="name-error">
                {fetcher.data.errors.fieldErrors.name}
              </Form.ErrorMessage>
            ) : null}
          </Form.Field>
        </Form.Fields>

        <Form.Action asChild>
          <Action>{isCreate ? "Créer" : "Enregistrer"}</Action>
        </Form.Action>
      </fetcher.Form>
    </Form>
  );
}
