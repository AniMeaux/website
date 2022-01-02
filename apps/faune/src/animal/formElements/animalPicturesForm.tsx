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
import styled from "styled-components";
import { theme } from "styles/theme";

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
      <Preview>
        <AnimalAvatar>
          {value.pictures.length === 0 ? (
            <FaPaw />
          ) : (
            <AnimalImage image={value.pictures[0]} alt="Avatar" />
          )}
        </AnimalAvatar>

        <Info>La première photo sera utilisée comme avatar</Info>
      </Preview>

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

const Preview = styled.div`
  padding: ${theme.spacing.x2} ${theme.spacing.x4};
  display: flex;
  align-items: center;
`;

const AnimalAvatar = styled(Avatar)`
  font-size: 60px;
`;

const AnimalImage = styled(Image)`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const Info = styled.p`
  margin-left: ${theme.spacing.x4};
  flex: 1;
  color: ${theme.colors.text.secondary};
`;
