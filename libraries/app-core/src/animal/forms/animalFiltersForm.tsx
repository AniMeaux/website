import { AnimalFilters } from "@animeaux/shared-entities";
import { Field, Form, Label } from "@animeaux/ui-library";
import * as React from "react";
import { AnimalMultipleStatusInput } from "../../animalMultipleStatusInput";

export type AnimalFiltersFormProps = {
  value: AnimalFilters;
  onChange: React.Dispatch<React.SetStateAction<AnimalFilters>>;
};

export function AnimalFiltersForm({ value, onChange }: AnimalFiltersFormProps) {
  return (
    <Form>
      <Field>
        <Label>Status</Label>
        <AnimalMultipleStatusInput
          value={value.status}
          onChange={(status) => onChange((value) => ({ ...value, status }))}
        />
      </Field>
    </Form>
  );
}
