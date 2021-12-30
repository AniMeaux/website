import {
  AnimalGenderLabels,
  AnimalProfileFormPayload,
  ANIMAL_GENDERS_ORDER,
} from "@animeaux/shared-entities";
import { AnimalGenderIcon } from "animal/animalGenderIcon";
import { AnimalSpeciesIcon } from "animal/animalSpeciesIcon";
import { AnimalSpeciesInput } from "animal/formElements/animalSpeciesInput";
import { ActionAdornment, Adornment } from "core/formElements/adornment";
import { DateInput } from "core/formElements/dateInput";
import { Field, Fields } from "core/formElements/field";
import { FieldMessage } from "core/formElements/fieldMessage";
import { Form, FormProps } from "core/formElements/form";
import { Input } from "core/formElements/input";
import { Label } from "core/formElements/label";
import { LinkInput } from "core/formElements/linkInput";
import {
  Selector,
  SelectorIcon,
  SelectorItem,
  SelectorLabel,
  SelectorRadio,
  Selectors,
} from "core/formElements/selector";
import { SubmitButton } from "core/formElements/submitButton";
import { Textarea } from "core/formElements/textarea";
import {
  FaComment,
  FaDna,
  FaFingerprint,
  FaPalette,
  FaTimes,
} from "react-icons/fa";

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
      <Fields>
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
          <Label
            htmlFor="animal-birthdate"
            hasError={errors?.birthdate != null}
          >
            Date de naissance
          </Label>

          <DateInput
            name="animal-birthdate"
            id="animal-birthdate"
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

          <Selectors isStretched>
            {ANIMAL_GENDERS_ORDER.map((gender) => (
              <SelectorItem key={gender}>
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
                  onClick={() =>
                    onChange((value) => ({ ...value, breed: null }))
                  }
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

          <LinkInput
            href="../color"
            value={value.color?.name}
            leftAdornment={
              <Adornment>
                <FaPalette />
              </Adornment>
            }
            rightAdornment={
              value.color != null && (
                <ActionAdornment
                  onClick={() =>
                    onChange((value) => ({ ...value, color: null }))
                  }
                >
                  <FaTimes />
                </ActionAdornment>
              )
            }
          />
        </Field>

        <Field>
          <Label htmlFor="animal-i-cad-number" isOptional>
            Numéro I-CAD
          </Label>

          <Input
            name="animal-i-cad-number"
            id="animal-i-cad-number"
            type="text"
            value={value.iCadNumber}
            onChange={(iCadNumber) =>
              onChange((value) => ({ ...value, iCadNumber }))
            }
            leftAdornment={
              <Adornment>
                <FaFingerprint />
              </Adornment>
            }
          />
        </Field>

        <Field>
          <Label htmlFor="description" isOptional>
            Description
          </Label>

          <Textarea
            name="description"
            id="description"
            value={value.description}
            onChange={(description) =>
              onChange((value) => ({ ...value, description }))
            }
          />
        </Field>
      </Fields>

      <SubmitButton loading={pending}>
        {isEdit ? "Modifier" : "Suivant"}
      </SubmitButton>
    </Form>
  );
}
