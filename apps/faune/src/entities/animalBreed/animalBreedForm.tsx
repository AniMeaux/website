import {
  AnimalBreed,
  AnimalBreedFormPayload,
  ANIMAL_SPECIES_ALPHABETICAL_ORDER,
} from "@animeaux/shared-entities";
import { AnimalSpeciesInput } from "entities/animal/formElements/animalSpeciesInput";
import * as React from "react";
import { FaDna } from "react-icons/fa";
import { Adornment } from "ui/formElements/adornment";
import { Field } from "ui/formElements/field";
import { FieldMessage } from "ui/formElements/fieldMessage";
import { Form, FormProps } from "ui/formElements/form";
import { Input } from "ui/formElements/input";
import { Label } from "ui/formElements/label";
import { SelectorItem, Selectors } from "ui/formElements/selector";
import { SubmitButton } from "ui/formElements/submitButton";
import { Placeholder, Placeholders } from "ui/loaders/placeholder";

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
  const [name, setName] = React.useState(animalBreed?.name ?? "");
  const [species, setSpecies] = React.useState(animalBreed?.species ?? null);

  React.useEffect(() => {
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

      <SubmitButton disabled={pending}>
        {animalBreed == null ? "Créer" : "Modifier"}
      </SubmitButton>
    </Form>
  );
}

export function AnimalBreedFormPlaceholder() {
  return (
    <Form>
      <Field>
        <Label>
          <Placeholder preset="label" />
        </Label>

        <Placeholder preset="input" />
      </Field>

      <Field>
        <Label>
          <Placeholder preset="label" />
        </Label>

        <Selectors>
          <Placeholders count={ANIMAL_SPECIES_ALPHABETICAL_ORDER.length}>
            <SelectorItem>
              <Placeholder preset="selector" />
            </SelectorItem>
          </Placeholders>
        </Selectors>
      </Field>
    </Form>
  );
}
