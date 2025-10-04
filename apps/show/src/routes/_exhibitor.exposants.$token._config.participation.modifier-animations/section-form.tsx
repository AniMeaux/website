import { FieldTextarea } from "#core/form-elements/field-textarea";
import { FormLayout } from "#core/layout/form-layout";
import { HelperCard } from "#core/layout/helper-card";
import { CardAnimationsOnStand } from "#exhibitors/animations/card-animations-on-stand";
import type { FieldMetadata } from "@conform-to/react";
import { getFormProps, useForm as useFormBase } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import {
  Form,
  useActionData,
  useFormAction,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { ActionSchema } from "./action";
import type { action, loader } from "./route";

export function SectionForm() {
  const formAction = useFormAction();
  const navigation = useNavigation();
  const [form, fieldset] = useForm();

  const fieldsetOnStandAnimations = fieldset.onStandAnimations as FieldMetadata<
    undefined | string
  >;

  return (
    <FormLayout.Form asChild>
      <Form {...getFormProps(form)} method="POST">
        <FormLayout.Section>
          <FormLayout.Title>Animations sur stand</FormLayout.Title>

          <HelperCard.Root color="alabaster">
            <p>
              Vous avez la possibilité d’organiser une animation sur votre stand
              (atelier, offre promotionnelle spéciale, ou encore un reversement
              d’une partie de vos ventes à l’association, etc…).
            </p>

            <p>
              Vous pouvez renseigner toutes les informations concernant votre
              animation afin de faciliter sa mise en avant et son organisation.
            </p>

            <p>
              N’oubliez pas d’ajouter le lien vers le système d’inscription le
              cas échéant !
            </p>
          </HelperCard.Root>

          <FormLayout.Row>
            <FieldTextarea
              label="Description"
              field={fieldsetOnStandAnimations}
              rows={3}
              placeholder="Personnalisation d’accessoires. [Inscrivez-vous !](https://lien.fr)"
            />

            {fieldsetOnStandAnimations.value != null ? (
              <FormLayout.Field>
                <FormLayout.Label>Aperçu</FormLayout.Label>

                <CardAnimationsOnStand
                  onStandAnimations={fieldsetOnStandAnimations.value}
                />
              </FormLayout.Field>
            ) : null}
          </FormLayout.Row>
        </FormLayout.Section>

        <FormLayout.SectionSeparator />

        <FormLayout.Action
          isLoading={
            navigation.state !== "idle" && navigation.formAction === formAction
          }
        >
          Enregistrer
        </FormLayout.Action>
      </Form>
    </FormLayout.Form>
  );
}

function useForm() {
  const { exhibitor } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [form, fields] = useFormBase({
    id: "exhibitor-animation-on-stand",
    constraint: getZodConstraint(ActionSchema),
    shouldValidate: "onBlur",
    lastResult: actionData,

    defaultValue: {
      onStandAnimations: exhibitor.onStandAnimations,
    },

    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: ActionSchema }),
  });

  return [form, fields] as const;
}
