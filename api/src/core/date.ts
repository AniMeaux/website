import invariant from "tiny-invariant";

/**
 * To fix issue where prisma use `Date` type when it's a `string` in runtime.
 * @see https://github.com/prisma/prisma/issues/12540
 *
 * @param date The date wrongly typed.
 * @returns The date casted as string
 */
export function fromPrismaDate(date: Date): string {
  invariant(typeof date === "string", "Dates from prisma should be strings");
  return date;
}
