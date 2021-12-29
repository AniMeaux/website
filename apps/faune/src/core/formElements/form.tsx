import { ChildrenProp, StyleProps } from "core/types";
import styled from "styled-components/macro";

export type FormProps = StyleProps &
  ChildrenProp & {
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
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
  display: flex;
  flex-direction: column;
`;
