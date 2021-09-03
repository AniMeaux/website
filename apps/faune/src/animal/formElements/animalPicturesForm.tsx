import { AnimalPicturesFormPayload } from "@animeaux/shared-entities";
import { callSetStateAction } from "core/callSetStateAction";
import { Avatar } from "core/dataDisplay/avatar";
import { Image } from "core/dataDisplay/image";
import { Field } from "core/formElements/field";
import { FieldMessage } from "core/formElements/fieldMessage";
import { Form, FormProps } from "core/formElements/form";
import { ImageInput } from "core/formElements/imageInput";
import { SubmitButton } from "core/formElements/submitButton";
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
