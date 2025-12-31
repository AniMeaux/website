import { notFound } from "#i/core/response.server";

export function assertIsDefined<T>(
  value: T | null | undefined,
): asserts value is T {
  if (value == null) {
    throw notFound();
  }
}
