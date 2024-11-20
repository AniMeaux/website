import type { Resend } from "resend";

export abstract class ResendDelegate<TOptions extends object = {}> {
  // It's not useless because it automatically initialize the instance
  // attribute `resend`.
  // eslint-disable-next-line no-useless-constructor
  constructor(
    protected readonly resend: null | Resend,
    protected readonly options?: TOptions,
  ) {}
}
