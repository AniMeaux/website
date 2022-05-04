import { StyleProps } from "~/core/types";

export type RawRadioProps = StyleProps & {
  checked: boolean;
  name: string;
  onChange: React.Dispatch<void>;
};

export function RawRadio({ onChange, ...rest }: RawRadioProps) {
  return <input {...rest} type="radio" onChange={() => onChange()} />;
}
