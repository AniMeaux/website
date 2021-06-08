import { AnimalPicturesFormPayload } from "@animeaux/shared-entities";
import { callSetStateAction } from "core/callSetStateAction";
import { Avatar } from "dataDisplay/avatar";
import { Image } from "dataDisplay/image";
import { Field } from "formElements/field";
import { FieldMessage } from "formElements/fieldMessage";
import { Form, FormProps } from "formElements/form";
import { ImageInput } from "formElements/imageInput";
import { SubmitButton } from "formElements/submitButton";
import * as React from "react";
import { FaPaw } from "react-icons/fa";

export type AnimalPicturesFormErrors = {
  avatar?: string | null;
};

export type AnimalPicturesFormProps<PayloadType> = FormProps & {
  isEdit?: boolean;
  value: PayloadType;
  onChange: React.Dispatch<React.SetStateAction<PayloadType>>;
  errors?: AnimalPicturesFormErrors;
};

export function AnimalPicturesForm<
  PayloadType extends AnimalPicturesFormPayload
>({
  isEdit = false,
  value,
  onChange,
  errors,
  pending,
  ...rest
}: AnimalPicturesFormProps<PayloadType>) {
  return (
    <Form {...rest} pending={pending}>
      <div className="AnimalPictureForm__preview">
        <Avatar className="AnimalPictureForm__avatar">
          {value.pictures.length === 0 ? (
            <FaPaw />
          ) : (
            <Image
              image={value.pictures[0]}
              alt="Avatar"
              className="AnimalPictureForm__image"
            />
          )}
        </Avatar>

        <p className="AnimalPictureForm__info">
          La première photo sera utilisée comme avatar
        </p>
      </div>

      <Field>
        <FieldMessage placement="top" errorMessage={errors?.avatar} />
        <ImageInput
          value={value.pictures}
          onChange={(change) =>
            onChange((value) => ({
              ...value,
              pictures: callSetStateAction(change, value.pictures),
            }))
          }
        />
      </Field>

      <SubmitButton loading={pending}>
        {isEdit ? "Modifier" : "Créer"}
      </SubmitButton>
    </Form>
  );
}
