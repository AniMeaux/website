import { AnimalPicturesFormPayload } from "@animeaux/shared-entities";
import {
  Avatar,
  callSetStateAction,
  Field,
  FieldMessage,
  Form,
  FormProps,
  Image,
  ImageInput,
  SubmitButton,
} from "@animeaux/ui-library";
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
      <div className="py-2 px-4 flex items-center">
        <Avatar size="display">
          {value.pictures.length === 0 ? (
            <FaPaw />
          ) : (
            <Image
              image={value.pictures[0]}
              preset="avatar"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          )}
        </Avatar>

        <p className="ml-4 flex-1 text-black text-opacity-60 text-sm">
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

      <SubmitButton disabled={pending}>
        {isEdit ? "Modifier" : "Créer"}
      </SubmitButton>
    </Form>
  );
}
