import {
  AnimalSituationFormPayload,
  TrileanLabels,
  TRILEAN_ORDER,
} from "@animeaux/shared-entities";
import { AnimalStatusInput } from "entities/animal/formElements/animalStatusInput";
import * as React from "react";
import { FaExclamationTriangle, FaHome, FaTimes } from "react-icons/fa";
import { ActionAdornment, Adornment } from "ui/formElements/adornment";
import { DateInput } from "ui/formElements/dateInput";
import { Field } from "ui/formElements/field";
import { FieldMessage } from "ui/formElements/fieldMessage";
import { Form, FormProps } from "ui/formElements/form";
import { Label } from "ui/formElements/label";
import { LinkInput } from "ui/formElements/linkInput";
import {
  Selector,
  SelectorItem,
  SelectorLabel,
  SelectorRadio,
  Selectors,
} from "ui/formElements/selector";
import { SubmitButton } from "ui/formElements/submitButton";
import { Textarea } from "ui/formElements/textarea";

export type AnimalSituationFormErrors = {
  pickUpDate?: string | null;
};

export type AnimalSituationFormProps<PayloadType> = FormProps & {
  isEdit?: boolean;
  value: PayloadType;
  onChange: React.Dispatch<React.SetStateAction<PayloadType>>;
  errors?: AnimalSituationFormErrors;
};

export function AnimalSituationForm<
  PayloadType extends AnimalSituationFormPayload
>({
  isEdit = false,
  value,
  onChange,
  errors,
  pending,
  ...rest
}: AnimalSituationFormProps<PayloadType>) {
  return (
    <Form {...rest} pending={pending}>
      <Field>
        <Label>Statut</Label>

        <AnimalStatusInput
          value={value.status}
          onChange={(status) => onChange((value) => ({ ...value, status }))}
        />
      </Field>

      <Field>
        <Label htmlFor="pick-up-date" hasError={errors?.pickUpDate != null}>
          Date de prise en charge
        </Label>

        <DateInput
          name="pick-up-date"
          id="pick-up-date"
          value={value.pickUpDate}
          onChange={(pickUpDate) =>
            onChange((value) => ({ ...value, pickUpDate }))
          }
          hasError={errors?.pickUpDate != null}
        />

        <FieldMessage errorMessage={errors?.pickUpDate} />
      </Field>

      <Field>
        <Label isOptional>Famille d'accueil</Label>

        <LinkInput
          href="../host-family"
          value={value.hostFamily?.name}
          leftAdornment={
            <Adornment>
              <FaHome />
            </Adornment>
          }
          rightAdornment={
            value.hostFamily != null && (
              <ActionAdornment
                onClick={() =>
                  onChange((value) => ({ ...value, hostFamily: null }))
                }
              >
                <FaTimes />
              </ActionAdornment>
            )
          }
        />
      </Field>

      <Field>
        <Label>Ok enfants</Label>

        <Selectors isStretched>
          {TRILEAN_ORDER.map((trileanValue) => (
            <SelectorItem key={trileanValue}>
              <Selector>
                <SelectorRadio
                  name="is-ok-children"
                  checked={value.isOkChildren === trileanValue}
                  onChange={() =>
                    onChange((value) => ({
                      ...value,
                      isOkChildren: trileanValue,
                    }))
                  }
                />

                <SelectorLabel>{TrileanLabels[trileanValue]}</SelectorLabel>
              </Selector>
            </SelectorItem>
          ))}
        </Selectors>
      </Field>

      <Field>
        <Label>Ok chiens</Label>

        <Selectors isStretched>
          {TRILEAN_ORDER.map((trileanValue) => (
            <SelectorItem key={trileanValue}>
              <Selector>
                <SelectorRadio
                  name="is-ok-dogs"
                  checked={value.isOkDogs === trileanValue}
                  onChange={() =>
                    onChange((value) => ({ ...value, isOkDogs: trileanValue }))
                  }
                />

                <SelectorLabel>{TrileanLabels[trileanValue]}</SelectorLabel>
              </Selector>
            </SelectorItem>
          ))}
        </Selectors>
      </Field>

      <Field>
        <Label>Ok chats</Label>

        <Selectors isStretched>
          {TRILEAN_ORDER.map((trileanValue) => (
            <SelectorItem key={trileanValue}>
              <Selector>
                <SelectorRadio
                  name="is-ok-cats"
                  checked={value.isOkCats === trileanValue}
                  onChange={() =>
                    onChange((value) => ({ ...value, isOkCats: trileanValue }))
                  }
                />

                <SelectorLabel>{TrileanLabels[trileanValue]}</SelectorLabel>
              </Selector>
            </SelectorItem>
          ))}
        </Selectors>
      </Field>

      <Field>
        <Label>Stérilisé</Label>

        <Selectors isStretched>
          <SelectorItem>
            <Selector>
              <SelectorRadio
                name="is-sterilized"
                checked={value.isSterilized}
                onChange={() =>
                  onChange((value) => ({ ...value, isSterilized: true }))
                }
              />

              <SelectorLabel>Oui</SelectorLabel>
            </Selector>
          </SelectorItem>

          <SelectorItem>
            <Selector>
              <SelectorRadio
                name="is-sterilized"
                checked={!value.isSterilized}
                onChange={() =>
                  onChange((value) => ({ ...value, isSterilized: false }))
                }
              />

              <SelectorLabel>Non</SelectorLabel>
            </Selector>
          </SelectorItem>
        </Selectors>
      </Field>

      <Field>
        <Label htmlFor="comments" isOptional>
          Attentions
        </Label>

        <Textarea
          name="comments"
          id="comments"
          value={value.comments}
          onChange={(comments) => onChange((value) => ({ ...value, comments }))}
          leftAdornment={
            <Adornment>
              <FaExclamationTriangle />
            </Adornment>
          }
        />
      </Field>

      <SubmitButton loading={pending}>
        {isEdit ? "Modifier" : "Suivant"}
      </SubmitButton>
    </Form>
  );
}
