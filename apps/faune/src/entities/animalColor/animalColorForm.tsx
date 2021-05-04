import { AnimalColor, AnimalColorFormPayload } from "@animeaux/shared-entities";
import * as React from "react";
import { FaPalette } from "react-icons/fa";
import { Adornment } from "ui/formElements/adornment";
import { Field } from "ui/formElements/field";
import { FieldMessage } from "ui/formElements/fieldMessage";
import { Form, FormProps } from "ui/formElements/form";
import { Input } from "ui/formElements/input";
import { Label } from "ui/formElements/label";
import { SubmitButton } from "ui/formElements/submitButton";
import { Placeholder } from "ui/loaders/placeholder";

export type AnimalColorFormErrors = {
  name?: string | null;
};

type AnimalColorFormProps = Omit<FormProps, "onSubmit"> & {
  animalColor?: AnimalColor;
  onSubmit: (payload: AnimalColorFormPayload) => any;
  errors?: AnimalColorFormErrors;
};

export function AnimalColorForm({
  animalColor,
  onSubmit,
  errors,
  pending,
  ...rest
}: AnimalColorFormProps) {
  const [name, setName] = React.useState(animalColor?.name ?? "");

  React.useEffect(() => {
    if (animalColor != null) {
      setName(animalColor.name);
    }
  }, [animalColor]);

  return (
    <Form {...rest} pending={pending} onSubmit={() => onSubmit({ name })}>
      <Field>
        <Label htmlFor="animal-color-name" hasError={errors?.name != null}>
          Nom
        </Label>

        <Input
          name="animal-color-name"
          id="animal-color-name"
          type="text"
          value={name}
          onChange={setName}
          hasError={errors?.name != null}
          leftAdornment={
            <Adornment>
              <FaPalette />
            </Adornment>
          }
        />

        <FieldMessage errorMessage={errors?.name} />
      </Field>

      <SubmitButton disabled={pending}>
        {animalColor == null ? "Créer" : "Modifier"}
      </SubmitButton>
    </Form>
  );
}

export function AnimalColorFormPlaceholder() {
  return (
    <Form>
      <Field>
        <Label>
          <Placeholder preset="label" />
        </Label>

        <Placeholder preset="input" />
      </Field>
    </Form>
  );
}
