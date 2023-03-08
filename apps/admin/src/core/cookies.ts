import Cookies, { CookieAttributes } from "js-cookie";
import { z } from "zod";

type AppCookie<TSchema extends z.ZodType<any, any, any>> = {
  name: string;
  schema: TSchema;
};

export function createAppCookie<TSchema extends z.ZodType<any, any, any>>(
  name: string,
  schema: TSchema
) {
  return { name, schema } satisfies AppCookie<TSchema>;
}

export function createClientCookie<TSchema extends z.ZodType<any, any, any>>(
  appCookie: AppCookie<TSchema>
) {
  return {
    set(value: z.infer<TSchema>, options: CookieAttributes = {}) {
      Cookies.set(appCookie.name, JSON.stringify(value), options);
    },

    get(): null | z.infer<TSchema> {
      const value = Cookies.get(appCookie.name);
      if (value == null) {
        return null;
      }

      return appCookie.schema.parse(JSON.parse(value));
    },

    remove() {
      Cookies.remove(appCookie.name);
    },
  };
}
