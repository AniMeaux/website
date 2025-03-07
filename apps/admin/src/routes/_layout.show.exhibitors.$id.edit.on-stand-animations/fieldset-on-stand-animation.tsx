import { Markdown, SENTENCE_COMPONENTS } from "#core/data-display/markdown";
import { FieldTextarea } from "#core/form-elements/field-textarea";
import { Form } from "#core/form-elements/form";
import { Card } from "#core/layout/card";
import { useForm } from "./form";

export function FieldsetOnStandAnimation() {
  const { fields } = useForm();

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
              field={fields.onStandAnimations}
              rows={5}
              placeholder="Personnalisation d’accessoires. [Inscrivez-vous !](https://lien.fr)"
            />

            {fields.onStandAnimations.value != null ? (
              <Form.Field>
                <Form.Label>Aperçu</Form.Label>

                <p className="rounded-1 bg-gray-100 p-1">
                  <Markdown components={SENTENCE_COMPONENTS}>
                    {fields.onStandAnimations.value}
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
