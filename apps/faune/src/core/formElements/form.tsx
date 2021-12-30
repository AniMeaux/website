import { ChildrenProp, StyleProps } from "core/types";
import styled from "styled-components/macro";
import { theme } from "styles/theme";

export type FormProps = StyleProps &
  ChildrenProp & {
    onSubmit?: React.FormEventHandler<HTMLFormElement>;
    pending?: boolean;
  };

export function Form({ onSubmit, pending = false, ...rest }: FormProps) {
  return (
    <FormElement
      {...rest}
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (onSubmit != null && !pending) {
          onSubmit(event);
        }
      }}
    />
  );
}

const FormElement = styled.form`
  position: relative;
  padding: ${theme.spacing.x3} ${theme.spacing.x4};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.x8};
`;
