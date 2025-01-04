export async function catchError<TResult>(cb: () => Promise<TResult>) {
  try {
    const result = await cb();
    return [undefined, result] as const;
  } catch (error) {
    return [
      // Because `error` is of type `unknown`, it breaks the typing we're
      // trying to have with these const tuples.
      // With `!` the type becomes `{}` and still requires some type checks
      // before being manipulated.
      error!,
      undefined,
    ] as const;
  }
}
