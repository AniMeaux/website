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
  Message,
  Placeholder,
  Placeholders,
  RequiredStar,
  Section,
  SectionTitle,
  Selector,
  SelectorIcon,
  SelectorItem,
  SelectorLabel,
  SelectorRadio,
  Selectors,
  Separator,
  Submit,
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
      <Section>
        <SectionTitle>Détails</SectionTitle>

        <Field>
          <Label htmlFor="animal-breed-name">
            Nom <RequiredStar />
          </Label>
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
                <FaDna />
              </Adornment>
            }
          />
        </Field>
      </Section>

      <Separator />

      <Section>
        <SectionTitle>
          Espèce <RequiredStar />
        </SectionTitle>

        {errors?.species != null && (
          <Message type="error" className="mx-2 my-4">
            {errors.species}
          </Message>
        )}

        <Selectors>
          {ANIMAL_SPECIES_ALPHABETICAL_ORDER.map((s) => (
            <SelectorItem
              key={s}
              itemsCount={ANIMAL_SPECIES_ALPHABETICAL_ORDER.length}
            >
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

        <Field>
          <Label>
            <Placeholder preset="label" />
          </Label>

          <Placeholder preset="input" />
        </Field>
      </Section>

      <Separator />

      <Section>
        <SectionTitle>
          <Placeholder preset="text" />
        </SectionTitle>

        <Selectors>
          <Placeholders count={ANIMAL_SPECIES_ALPHABETICAL_ORDER.length}>
            <SelectorItem itemsCount={ANIMAL_SPECIES_ALPHABETICAL_ORDER.length}>
              <Placeholder preset="selector" />
            </SelectorItem>
          </Placeholders>
        </Selectors>
      </Section>
    </Form>
  );
}
