import { Action } from "#core/actions";
import { Form } from "#core/form-elements/form";
import { Input } from "#core/form-elements/input";
import { RequiredStar } from "#core/form-elements/required-star";
import { Icon } from "#generated/icon";
import { FormDataDelegate } from "@animeaux/form-data";
import type { Color } from "@animeaux/prisma/client";
import { zu } from "@animeaux/zod-utils";
import type { SerializeFrom } from "@remix-run/node";
import type { FetcherWithComponents } from "@remix-run/react";
import { useEffect, useRef } from "react";

export const ActionFormData = FormDataDelegate.create(
  zu.object({
    name: zu.string().trim().min(1, "Veuillez entrer un nom"),
  }),
);

export function ColorForm({
  defaultColor,
  fetcher,
}: {
  defaultColor?: SerializeFrom<Pick<Color, "name">>;
  fetcher: FetcherWithComponents<{
    errors?: zu.inferFlattenedErrors<typeof ActionFormData.schema>;
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
                  <Icon href="icon-palette-solid" />
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
