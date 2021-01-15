import {
  AnimalBreed,
  AnimalBreedFormPayload,
  AnimalSpeciesLabels,
  ANIMAL_SPECIES_ALPHABETICAL_ORDER,
} from "@animeaux/shared-entities";
import * as React from "react";
import { FaDna } from "react-icons/fa";
import { Button } from "../../ui/button";
import { Adornment } from "../../ui/formElements/adornment";
import { Field } from "../../ui/formElements/field";
import { Form, FormProps } from "../../ui/formElements/form";
import { Input } from "../../ui/formElements/input";
import { Label } from "../../ui/formElements/label";
import { Select } from "../../ui/formElements/select";
import { Placeholder, Placeholders } from "../../ui/loaders/placeholder";
import { ResourceIcon } from "../resource";

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
        <Label htmlFor="animal-breed-name">Nom</Label>
        <Input
          name="animal-breed-name"
          id="animal-breed-name"
          type="text"
          autoComplete="animal-breed-name"
          value={name}
          onChange={setName}
          autoFocus
          errorMessage={errors?.name}
          leftAdornment={
            <Adornment>
              <ResourceIcon resourceKey="animal_breed" />
            </Adornment>
          }
        />
      </Field>

      <Field>
        <Label htmlFor="species">Espèce</Label>
        <Select
          name="species"
          id="species"
          value={species}
          onChange={setSpecies}
          placeholder="Choisir une espèce"
          errorMessage={errors?.species}
          leftAdornment={
            <Adornment>
              <FaDna />
            </Adornment>
          }
        >
          {ANIMAL_SPECIES_ALPHABETICAL_ORDER.map((species) => (
            <option key={species} value={species}>
              {AnimalSpeciesLabels[species]}
            </option>
          ))}
        </Select>
      </Field>

      <Field>
        <Button type="submit" variant="primary" color="blue" disabled={pending}>
          {animalBreed == null ? "Créer" : "Modifier"}
        </Button>
      </Field>
    </Form>
  );
}

export function AnimalBreedFormPlaceholder() {
  return (
    <Form>
      <Placeholders count={2}>
        <Field>
          <Label>
            <Placeholder preset="label" />
          </Label>

          <Placeholder preset="input" />
        </Field>
      </Placeholders>
    </Form>
  );
}
