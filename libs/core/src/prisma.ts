import type { Prisma } from "@prisma/client";

/**
 * Primsa doesn't return a real Promise. This function wraps it in a real
 * promise.
 *
 * @param promise The Prisma.PrismaPromise
 * @returns A Promise.
 *
 * @see https://github.com/remix-run/remix/issues/5153#issuecomment-1538484918
 */
export async function fromPrismaPromise<TData>(
  promise: Prisma.PrismaPromise<TData>,
) {
  return promise;
}
