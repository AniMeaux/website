import {
  AnimalBreed,
  AnimalBreedFormPayload,
  AnimalSpeciesLabels,
  ANIMAL_SPECIES_ALPHABETICAL_ORDER,
} from "@animeaux/shared-entities";
import {
  Adornment,
  Field,
  FieldMessage,
  Form,
  FormProps,
  Input,
  Label,
  Placeholder,
  Placeholders,
  Selector,
  SelectorIcon,
  SelectorItem,
  SelectorLabel,
  SelectorRadio,
  Selectors,
  SubmitButton,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaDna } from "react-icons/fa";
import { AnimalSpeciesIcon } from "../animal/animalSpeciesIcon";

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
          autoComplete="animal-breed-name"
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

        <Selectors>
          {ANIMAL_SPECIES_ALPHABETICAL_ORDER.map((s) => (
            <SelectorItem key={s}>
              <Selector>
                <SelectorRadio
                  name="species"
                  checked={species === s}
                  onChange={() => setSpecies(s)}
                />

                <SelectorIcon>
                  <AnimalSpeciesIcon species={s} />
                </SelectorIcon>

                <SelectorLabel>{AnimalSpeciesLabels[s]}</SelectorLabel>
              </Selector>
            </SelectorItem>
          ))}
        </Selectors>

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
