import { AnimalFilters } from "@animeaux/shared-entities";
import { AnimalMultipleSpeciesInput } from "animal/formElements/animalMultipleSpeciesInput";
import { AnimalMultipleStatusInput } from "animal/formElements/animalMultipleStatusInput";
import { callSetStateAction } from "core/callSetStateAction";
import { Field, Fields } from "core/formElements/field";
import { Form } from "core/formElements/form";
import { Label } from "core/formElements/label";

export type AnimalFiltersFormProps = {
  value: AnimalFilters;
  onChange: React.Dispatch<React.SetStateAction<AnimalFilters>>;
};

export function AnimalFiltersForm({ value, onChange }: AnimalFiltersFormProps) {
  return (
    <Form>
      <Fields>
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
      </Fields>
    </Form>
  );
}
