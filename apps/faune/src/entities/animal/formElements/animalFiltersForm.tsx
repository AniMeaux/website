import { AnimalFilters } from "@animeaux/shared-entities";
import { callSetStateAction } from "core/callSetStateAction";
import { AnimalMultipleSpeciesInput } from "entities/animal/formElements/animalMultipleSpeciesInput";
import { AnimalMultipleStatusInput } from "entities/animal/formElements/animalMultipleStatusInput";
import { Field } from "formElements/field";
import { Form } from "formElements/form";
import { Label } from "formElements/label";
import * as React from "react";

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
