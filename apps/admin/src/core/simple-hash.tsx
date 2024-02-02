export function simpleHash(value: string) {
  const hexValue = value
    .split("")
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("")
    .substring(0, 8);

  return Number(`0x${hexValue}`);
}
