import { AnimalFilters } from "@animeaux/shared-entities";
import { callSetStateAction, Field, Form, Label } from "@animeaux/ui-library";
import * as React from "react";
import { AnimalMultipleSpeciesInput } from "../../animalMultipleSpeciesInput";
import { AnimalMultipleStatusInput } from "../../animalMultipleStatusInput";

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
