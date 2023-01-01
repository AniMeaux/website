import { useState } from "react";
import { Input, InputProps } from "~/core/formElements/input";
import { useLayoutEffect } from "~/core/useLayoutEffect";

/**
 * Input component to use when the value needs to be controlled by an external
 * state (URL).
 * Using a local state makes the input faster and preserve native state (cursor
 * position, date parts for date input).
 */
export function ControlledInput({
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
}
