import { SORTED_SPECIES, SPECIES_TRANSLATION } from "#animals/species.tsx";
import { createActionData } from "#core/actionData.tsx";
import { Action } from "#core/actions.tsx";
import { Form } from "#core/formElements/form.tsx";
import { Input } from "#core/formElements/input.tsx";
import { RadioInput, RadioInputList } from "#core/formElements/radioInput.tsx";
import { RequiredStar } from "#core/formElements/requiredStar.tsx";
import { Icon } from "#generated/icon.tsx";
import type { Breed } from "@prisma/client";
import { Species } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import type { FetcherWithComponents } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";

export const ActionFormData = createActionData(
  z.object({
    name: z.string().trim().min(1, "Veuillez entrer un nom"),
    species: z.nativeEnum(Species, {
      required_error: "Veuillez choisir une espèce",
    }),
  })
);

export function BreedForm({
  defaultBreed,
  fetcher,
}: {
  defaultBreed?: SerializeFrom<Pick<Breed, "name" | "species">>;
  fetcher: FetcherWithComponents<{
    errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
  }>;
}) {
  const isCreate = defaultBreed == null;
  const nameRef = useRef<HTMLInputElement>(null);
  const speciesRef = useRef<HTMLInputElement>(null);

  // Focus the first field having an error.
  useEffect(() => {
    if (fetcher.data?.errors != null) {
      if (fetcher.data.errors.formErrors.length > 0) {
        window.scrollTo({ top: 0 });
      } else if (fetcher.data.errors.fieldErrors.name != null) {
        nameRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.species != null) {
        speciesRef.current?.focus();
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
              defaultValue={defaultBreed?.name}
              hasError={fetcher.data?.errors?.fieldErrors.name != null}
              aria-describedby="name-error"
              leftAdornment={
                <Input.Adornment>
                  <Icon id="dna" />
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
            <Form.Label asChild>
              <span>
                Espèce <RequiredStar />
              </span>
            </Form.Label>

            <RadioInputList>
              {SORTED_SPECIES.map((species, index) => (
                <RadioInput
                  ref={index === 0 ? speciesRef : null}
                  key={species}
                  label={SPECIES_TRANSLATION[species]}
                  name={ActionFormData.keys.species}
                  value={species}
                  defaultChecked={defaultBreed?.species === species}
                  aria-describedby="species-error"
                />
              ))}
            </RadioInputList>

            {fetcher.data?.errors?.fieldErrors.species != null ? (
              <Form.ErrorMessage id="species-error">
                {fetcher.data.errors.fieldErrors.species}
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
