type BooleanAttribute = undefined | boolean | "true" | "false";

export function toBooleanAttribute(condition: boolean): BooleanAttribute {
  return condition ? "true" : undefined;
}

export function fromBooleanAttribute(value: BooleanAttribute) {
  return String(value) === "true";
}
