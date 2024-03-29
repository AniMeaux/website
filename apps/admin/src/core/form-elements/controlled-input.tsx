import type { InputProps } from "#core/form-elements/input";
import { Input } from "#core/form-elements/input";
import { useLayoutEffect } from "#core/use-layout-effect";
import { useState } from "react";

/**
 * Input component to use when the value needs to be controlled by an external
 * state (URL).
 * Using a local state makes the input faster and preserve native state (cursor
 * position, date parts for date input).
 */
export const ControlledInput = Object.assign(
  function ControlledInput({
    value: valueProp,
    onChange: onChangeProp,
    ...rest
  }: Omit<InputProps, "value"> & Required<Pick<InputProps, "value">>) {
    const [value, setValue] = useState(valueProp);

    useLayoutEffect(() => {
      setValue(valueProp);
    }, [valueProp]);

    return (
      <Input
        {...rest}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          onChangeProp?.(event);
        }}
      />
    );
  },
  {
    Adornment: Input.Adornment,
    ActionAdornment: Input.ActionAdornment,
  },
);
