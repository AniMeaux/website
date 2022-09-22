export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\W+/g, "-")
    .replace(/(^-|-$)/g, "");
}
