import {
  AnimalBreed,
  AnimalBreedFormPayload,
  AnimalSpeciesLabels,
  ANIMAL_SPECIES_ALPHABETICAL_ORDER,
} from "@animeaux/shared-entities";
import {
  Adornment,
  Button,
  Field,
  Form,
  FormProps,
  Input,
  Label,
  Placeholder,
  Placeholders,
  Section,
  SectionTitle,
  Select,
  Separator,
  Submit,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaDna, FaTag } from "react-icons/fa";

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
      <Section>
        <SectionTitle>Détails</SectionTitle>

        <Field>
          <Label htmlFor="animal-breed-name">Nom</Label>
          <Input
            name="animal-breed-name"
            id="animal-breed-name"
            type="text"
            autoComplete="animal-breed-name"
            value={name}
            onChange={setName}
            errorMessage={errors?.name}
            leftAdornment={
              <Adornment>
                <FaTag />
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
      </Section>

      <Separator />

      <Section>
        <Submit>
          <Button
            type="submit"
            variant="primary"
            color="blue"
            disabled={pending}
          >
            {animalBreed == null ? "Créer" : "Modifier"}
          </Button>
        </Submit>
      </Section>
    </Form>
  );
}

export function AnimalBreedFormPlaceholder() {
  return (
    <Form>
      <Section>
        <SectionTitle>
          <Placeholder preset="text" />
        </SectionTitle>

        <Placeholders count={2}>
          <Field>
            <Label>
              <Placeholder preset="label" />
            </Label>

            <Placeholder preset="input" />
          </Field>
        </Placeholders>
      </Section>
    </Form>
  );
}
