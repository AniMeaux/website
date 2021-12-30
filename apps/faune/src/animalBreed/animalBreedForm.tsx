import {
  AnimalBreed,
  AnimalBreedFormPayload,
  ANIMAL_SPECIES_ALPHABETICAL_ORDER,
} from "@animeaux/shared-entities";
import { AnimalSpeciesInput } from "animal/formElements/animalSpeciesInput";
import { Adornment } from "core/formElements/adornment";
import { Field, Fields } from "core/formElements/field";
import { FieldMessage } from "core/formElements/fieldMessage";
import { Form, FormProps } from "core/formElements/form";
import { Input } from "core/formElements/input";
import { Label } from "core/formElements/label";
import { SelectorItem, Selectors } from "core/formElements/selector";
import { SubmitButton } from "core/formElements/submitButton";
import { Placeholder, Placeholders } from "core/loaders/placeholder";
import { useEffect, useState } from "react";
import { FaDna } from "react-icons/fa";

export type AnimalBreedFormErrors = {
  name?: string | null;
  species?: string | null;
};

type AnimalBreedFormProps = Omit<FormProps, "onSubmit"> & {
  animalBreed?: AnimalBreed;
  onSubmit: (payload: AnimalBreedFormPayload) => any;
  errors?: AnimalBreedFormErrors;
};

export function AnimalBreedForm({
  animalBreed,
  onSubmit,
  errors,
  pending,
  ...rest
}: AnimalBreedFormProps) {
  const [name, setName] = useState(animalBreed?.name ?? "");
  const [species, setSpecies] = useState(animalBreed?.species ?? null);

  useEffect(() => {
    if (animalBreed != null) {
      setName(animalBreed.name);
      setSpecies(animalBreed.species);
    }
  }, [animalBreed]);

  return (
    <Form
      {...rest}
      pending={pending}
      onSubmit={() => onSubmit({ name, species })}
    >
      <Fields>
        <Field>
          <Label htmlFor="animal-breed-name" hasError={errors?.name != null}>
            Nom
          </Label>

          <Input
            name="animal-breed-name"
            id="animal-breed-name"
            type="text"
            value={name}
            onChange={setName}
            hasError={errors?.name != null}
            leftAdornment={
              <Adornment>
                <FaDna />
              </Adornment>
            }
          />

          <FieldMessage errorMessage={errors?.name} />
        </Field>

        <Field>
          <Label hasError={errors?.species != null}>Espèce</Label>
          <AnimalSpeciesInput value={species} onChange={setSpecies} />
          <FieldMessage errorMessage={errors?.species} />
        </Field>
      </Fields>

      <SubmitButton loading={pending}>
        {animalBreed == null ? "Créer" : "Modifier"}
      </SubmitButton>
    </Form>
  );
}

export function AnimalBreedFormPlaceholder() {
  return (
    <Form>
      <Fields>
        <Field>
          <Label>
            <Placeholder $preset="label" />
          </Label>

          <Placeholder $preset="input" />
        </Field>

        <Field>
          <Label>
            <Placeholder $preset="label" />
          </Label>

          <Selectors>
            <Placeholders count={ANIMAL_SPECIES_ALPHABETICAL_ORDER.length}>
              <SelectorItem>
                <Placeholder $preset="selector" />
              </SelectorItem>
            </Placeholders>
          </Selectors>
        </Field>
      </Fields>
    </Form>
  );
}
