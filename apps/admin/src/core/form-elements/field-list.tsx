import { Action } from "#i/core/actions";
import { FieldErrorHelper } from "#i/core/form-elements/field-error-helper";
import { Form } from "#i/core/form-elements/form";
import { RequiredStar } from "#i/core/form-elements/required-star";
import { Icon } from "#i/generated/icon";
import type { FieldMetadata, FormMetadata } from "@conform-to/react";

export function FieldList<TItem, TForm extends Record<string, unknown>>({
  form,
  field,
  label,
  labelAddMore,
  helper,
  required = false,
  children,
}: {
  form: FormMetadata<TForm>;
  field: FieldMetadata<TItem[]>;
  label: React.ReactNode;
  labelAddMore: React.ReactNode;
  required?: boolean;
  helper?: React.ReactNode;
  children: (props: {
    field: FieldMetadata<TItem>;
    index: number;
  }) => React.ReactElement;
}) {
  const fields = field.getFieldList();

  return (
    <Form.Field>
      <Form.Label htmlFor={fields[0]?.id}>
        {label} {field.required || required ? <RequiredStar /> : null}
      </Form.Label>

      <div className="grid grid-cols-1 gap-0.5">
        {fields.map((itemField, index) => (
          <div key={itemField.key} className="grid grid-cols-1">
            <div className="grid grid-cols-fr-auto items-start gap-0.5">
              {children({ field: itemField, index })}

              <Action
                {...form.remove.getButtonProps({ index, name: field.name })}
                isIconOnly
                variant="secondary"
                color="gray"
                // There's always at least one item.
                disabled={fields.length === 1}
              >
                <Icon href="icon-x-mark-light" />
              </Action>
            </div>

            <FieldErrorHelper field={itemField} />
          </div>
        ))}

        <Action
          {...form.insert.getButtonProps({ name: field.name })}
          variant="secondary"
          color="gray"
          className="justify-self-center"
        >
          {labelAddMore}
        </Action>
      </div>

      {field.errors != null ? <FieldErrorHelper field={field} /> : helper}
    </Form.Field>
  );
}
