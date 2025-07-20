import { Markdown, SENTENCE_COMPONENTS } from "#core/data-display/markdown";
import { FieldTextarea } from "#core/form-elements/field-textarea";
import { Form } from "#core/form-elements/form";
import { Card } from "#core/layout/card";
import type { FieldMetadata } from "@conform-to/react";
import { useForm } from "./form";

export function FieldsetOnStandAnimation() {
  const { fields } = useForm();

  const fieldOnStandAnimations = fields.onStandAnimations as FieldMetadata<
    undefined | string
  >;

  return (
    <Card>
      <Card.Header>
        <Card.Title>Animations sur stand</Card.Title>
      </Card.Header>

      <Card.Content>
        <Form.Fields>
          <Form.Row>
            <FieldTextarea
              label="Description"
              field={fieldOnStandAnimations}
              rows={5}
              placeholder="Personnalisation d’accessoires. [Inscrivez-vous !](https://lien.fr)"
            />

            {fieldOnStandAnimations.value != null ? (
              <Form.Field>
                <Form.Label>Aperçu</Form.Label>

                <p className="rounded-1 bg-gray-100 p-1">
                  <Markdown components={SENTENCE_COMPONENTS}>
                    {fieldOnStandAnimations.value}
                  </Markdown>
                </p>
              </Form.Field>
            ) : null}
          </Form.Row>
        </Form.Fields>
      </Card.Content>
    </Card>
  );
}
