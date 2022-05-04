import { StyleProps } from "~/core/types";

export type RawCheckboxProps = StyleProps & {
  checked: boolean;
  name: string;
  onChange: React.Dispatch<boolean>;
};

export function RawCheckbox({ onChange, ...rest }: RawCheckboxProps) {
  return (
    <input
      {...rest}
      type="checkbox"
      onChange={(event) => onChange(event.target.checked)}
    />
  );
}
