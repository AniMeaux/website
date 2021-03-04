import {
  AnimalColorLabels,
  AnimalGenderLabels,
  AnimalProfileFormPayload,
  ANIMAL_COLORS_ORDER,
  ANIMAL_GENDERS_ORDER,
} from "@animeaux/shared-entities";
import {
  ActionAdornment,
  Adornment,
  DateInput,
  Field,
  FieldMessage,
  Form,
  FormProps,
  Input,
  Label,
  LinkInput,
  Select,
  Selector,
  SelectorIcon,
  SelectorItem,
  SelectorLabel,
  SelectorRadio,
  Selectors,
  SubmitButton,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaComment, FaDna, FaPalette, FaTimes } from "react-icons/fa";
import { AnimalSpeciesInput } from "../../animalSpeciesInput";
import { AnimalGenderIcon } from "../animalGenderIcon";
import { AnimalSpeciesIcon } from "../animalSpeciesIcon";

export type AnimalProfileFormErrors = {
  officialName?: string | null;
  birthdate?: string | null;
  gender?: string | null;
  species?: string | null;
  breed?: string | null;
};

export type AnimalProfileFormProps<PayloadType> = FormProps & {
  isEdit?: boolean;
  value: PayloadType;
  onChange: React.Dispatch<React.SetStateAction<PayloadType>>;
  errors?: AnimalProfileFormErrors;
};

export function AnimalProfileForm<
  PayloadType extends AnimalProfileFormPayload
>({
  isEdit = false,
  value,
  onChange,
  errors,
  pending,
  ...rest
}: AnimalProfileFormProps<PayloadType>) {
  return (
    <Form {...rest} pending={pending}>
      <Field>
        <Label hasError={errors?.species != null}>Espèce</Label>
        <AnimalSpeciesInput
          value={value.species}
          onChange={(species) => onChange((value) => ({ ...value, species }))}
        />
        <FieldMessage errorMessage={errors?.species} />
      </Field>

      <Field>
        <Label
          htmlFor="animal-official-name"
          hasError={errors?.officialName != null}
        >
          Nom officiel
        </Label>

        <Input
          name="animal-official-name"
          id="animal-official-name"
          type="text"
          autoComplete="animal-official-name"
          value={value.officialName}
          onChange={(officialName) =>
            onChange((value) => ({ ...value, officialName }))
          }
          hasError={errors?.officialName != null}
          leftAdornment={
            value.species != null && (
              <Adornment>
                <AnimalSpeciesIcon species={value.species} />
              </Adornment>
            )
          }
        />

        <FieldMessage errorMessage={errors?.officialName} />
      </Field>

      <Field>
        <Label htmlFor="animal-common-name" isOptional>
          Nom d'usage
        </Label>

        <Input
          name="animal-common-name"
          id="animal-common-name"
          type="text"
          autoComplete="animal-common-name"
          value={value.commonName}
          onChange={(commonName) =>
            onChange((value) => ({ ...value, commonName }))
          }
          leftAdornment={
            <Adornment>
              <FaComment />
            </Adornment>
          }
        />
      </Field>

      <Field>
        <Label htmlFor="animal-birthdate" hasError={errors?.birthdate != null}>
          Date de naissance
        </Label>

        <DateInput
          name="animal-birthdate"
          id="animal-birthdate"
          autoComplete="animal-birthdate"
          value={value.birthdate}
          onChange={(birthdate) =>
            onChange((value) => ({ ...value, birthdate }))
          }
          hasError={errors?.birthdate != null}
        />

        <FieldMessage errorMessage={errors?.birthdate} />
      </Field>

      <Field>
        <Label hasError={errors?.gender != null}>Genre</Label>

        <Selectors>
          {ANIMAL_GENDERS_ORDER.map((gender) => (
            <SelectorItem key={gender} isFlex>
              <Selector>
                <SelectorRadio
                  name="gender"
                  checked={value.gender === gender}
                  onChange={() => onChange((value) => ({ ...value, gender }))}
                />

                <SelectorIcon>
                  <AnimalGenderIcon gender={gender} />
                </SelectorIcon>

                <SelectorLabel>{AnimalGenderLabels[gender]}</SelectorLabel>
              </Selector>
            </SelectorItem>
          ))}
        </Selectors>

        <FieldMessage errorMessage={errors?.gender} />
      </Field>

      <Field>
        <Label isOptional>Race</Label>

        <LinkInput
          href="../breed"
          value={value.breed?.name}
          leftAdornment={
            <Adornment>
              <FaDna />
            </Adornment>
          }
          rightAdornment={
            value.breed != null && (
              <ActionAdornment
                onClick={() => onChange((value) => ({ ...value, breed: null }))}
              >
                <FaTimes />
              </ActionAdornment>
            )
          }
        />

        <FieldMessage errorMessage={errors?.breed} />
      </Field>

      <Field>
        <Label isOptional htmlFor="animal-color">
          Couleur
        </Label>

        <Select
          id="animal-color"
          value={value.color}
          onChange={(color) => onChange((value) => ({ ...value, color }))}
          leftAdornment={
            <Adornment>
              <FaPalette />
            </Adornment>
          }
          rightAdornment={
            value.color != null && (
              <ActionAdornment
                onClick={() => onChange((value) => ({ ...value, color: null }))}
              >
                <FaTimes />
              </ActionAdornment>
            )
          }
        >
          {ANIMAL_COLORS_ORDER.map((color) => (
            <option key={color} value={color}>
              {AnimalColorLabels[color]}
            </option>
          ))}
        </Select>
      </Field>

      <SubmitButton disabled={pending}>
        {isEdit ? "Modifier" : "Suivant"}
      </SubmitButton>
    </Form>
  );
}
