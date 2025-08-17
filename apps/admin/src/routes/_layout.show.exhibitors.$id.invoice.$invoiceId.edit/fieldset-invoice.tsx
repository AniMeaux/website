import { FieldDate } from "#core/form-elements/field-date.js";
import { FieldNumeric } from "#core/form-elements/field-numeric.js";
import { FieldRadios } from "#core/form-elements/field-radios";
import { FieldText } from "#core/form-elements/field-text";
import { FieldUrl } from "#core/form-elements/field-url.js";
import { Form } from "#core/form-elements/form";
import { Input } from "#core/form-elements/input.js";
import { Card } from "#core/layout/card";
import { Separator } from "#core/layout/separator";
import { Icon } from "#generated/icon.js";
import { InvoiceStatus } from "#show/invoice/status.js";
import { useForm } from "./form";

export function FieldsetInvoice() {
  const { form, fields } = useForm();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Facture</Card.Title>
      </Card.Header>

      <Card.Content>
        <Form.Fields>
          <Form.Errors errors={form.errors} />

          <Form.Row>
            <FieldText
              label="Numéro"
              field={fields.number}
              leftAdornment={
                <Input.Adornment>
                  <Icon href="icon-hashtag-light" />
                </Input.Adornment>
              }
            />

            <FieldRadios
              label="Statut"
              field={fields.status}
              getLabel={(status) => InvoiceStatus.translation[status]}
              options={InvoiceStatus.values}
            />
          </Form.Row>

          <Form.Row>
            <FieldNumeric
              label="Montant"
              field={fields.amount}
              leftAdornment={
                <Input.Adornment>
                  <Icon href="icon-tag-light" />
                </Input.Adornment>
              }
            />

            <FieldDate label="Date d’échéance" field={fields.dueDate} />
          </Form.Row>

          <Separator />

          <FieldUrl label="Lien de la facture" field={fields.url} />
        </Form.Fields>
      </Card.Content>
    </Card>
  );
}
