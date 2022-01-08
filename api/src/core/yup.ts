import { addMethod, string } from "yup";
import { DateTime } from "luxon";

declare module "yup" {
  interface StringSchema {
    dateISO(): this;
    ignoreEmpty(): this;
  }
}

addMethod(string, "dateISO", function date() {
  return this.test(
    "dateISO",
    // eslint-disable-next-line no-template-curly-in-string
    "${path} must be a valid ISO date.",
    (value) => value == null || DateTime.fromISO(value).isValid
  );
});

addMethod(string, "ignoreEmpty", function ignoreEmpty() {
  return this.transform((value, originalValue, context) => {
    return context.isType(value) && value === "" ? undefined : value;
  });
});
