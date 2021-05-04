import { AnimalFilters } from "@animeaux/shared-entities";
import { callSetStateAction } from "core/callSetStateAction";
import { AnimalMultipleSpeciesInput } from "entities/animal/formElements/animalMultipleSpeciesInput";
import { AnimalMultipleStatusInput } from "entities/animal/formElements/animalMultipleStatusInput";
import * as React from "react";
import { Field } from "ui/formElements/field";
import { Form } from "ui/formElements/form";
import { Label } from "ui/formElements/label";

export type AnimalFiltersFormProps = {
  value: AnimalFilters;
  onChange: React.Dispatch<React.SetStateAction<AnimalFilters>>;
};

export function AnimalFiltersForm({ value, onChange }: AnimalFiltersFormProps) {
  return (
    <Form>
      <Field>
        <Label>Espèce</Label>
        <AnimalMultipleSpeciesInput
          value={value.species}
          onChange={(change) =>
            onChange((value) => ({
              ...value,
              species: callSetStateAction(change, value.species ?? []),
            }))
          }
        />
      </Field>

      <Field>
        <Label>Statut</Label>
        <AnimalMultipleStatusInput
          value={value.status}
          onChange={(change) =>
            onChange((value) => ({
              ...value,
              status: callSetStateAction(change, value.status ?? []),
            }))
          }
        />
      </Field>
    </Form>
  );
}
