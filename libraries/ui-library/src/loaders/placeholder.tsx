import cn from "classnames";
import * as React from "react";

type PlaceholderPreset =
  | "avatar"
  | "avatar-small"
  | "avatar-xsmall"
  | "button"
  | "button-small"
  | "checkbox"
  | "checkbox-input"
  | "icon"
  | "input"
  | "input-small"
  | "label"
  | "selector"
  | "tag"
  | "text";

const PresetClassName: { [key in PlaceholderPreset]: string } = {
  avatar: "placeholder-avatar",
  "avatar-small": "placeholder-avatar-small",
  "avatar-xsmall": "placeholder-avatar-xsmall",
  button: "placeholder-button",
  "button-small": "placeholder-button-small",
  checkbox: "placeholder-checkbox",
  "checkbox-input": "placeholder-checkbox-input",
  icon: "placeholder-icon",
  input: "placeholder-input",
  "input-small": "placeholder-input-small",
  label: "placeholder-label",
  selector: "placeholder-selector",
  tag: "placeholder-tag",
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
