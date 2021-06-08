import cn from "classnames";
import * as React from "react";

export type PlaceholderPreset =
  | "avatar"
  | "avatar-small"
  | "icon"
  | "image"
  | "input"
  | "label"
  | "selector"
  | "text";

const PresetClassName: Record<PlaceholderPreset, string> = {
  avatar: "Placeholder--avatar",
  "avatar-small": "Placeholder--avatar Placeholder--avatarSmall",
  icon: "Placeholder--icon",
  image: "Placeholder--image",
  input: "Placeholder--input",
  label: "Placeholder--label",
  selector: "Placeholder--selector",
  text: "Placeholder--text",
};

type PlaceholderProps = React.HTMLAttributes<HTMLSpanElement> & {
  preset: PlaceholderPreset;
};

export function Placeholder({ preset, className, ...rest }: PlaceholderProps) {
  return (
    <span
      {...rest}
      className={cn(
        "placeholder Placeholder",
        PresetClassName[preset],
        className
      )}
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
