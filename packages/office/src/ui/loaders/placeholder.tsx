import cn from "classnames";
import * as React from "react";

type PlaceholderPreset =
  | "avatar"
  | "checkbox"
  | "checkbox-field"
  | "input"
  | "label"
  | "text";

const PresetClassName: { [key in PlaceholderPreset]: string } = {
  avatar: "placeholder-avatar",
  checkbox: "placeholder-checkbox",
  "checkbox-field": "placeholder-checkbox-field",
  input: "placeholder-input",
  label: "placeholder-label",
  text: "placeholder-text",
};

type PlaceholderProps = React.HTMLAttributes<HTMLSpanElement> & {
  preset: PlaceholderPreset;
};

export function Placeholder({ preset, className, ...rest }: PlaceholderProps) {
  return (
    <span
      {...rest}
      className={cn("placeholder", PresetClassName[preset], className)}
    />
  );
}

type PlaceholdersProps = {
  count?: number;
  children: React.ReactElement;
};

export function Placeholders({ count = 3, children }: PlaceholdersProps) {
  let placeholders: React.ReactElement[] = [];

  for (let index = 0; index < count; index++) {
    placeholders.push(React.cloneElement(children, { key: index }));
  }

  return <>{placeholders}</>;
}
