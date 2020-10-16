// Authentication errors have a `code` attribute.
// See https://firebase.google.com/docs/reference/js/firebase.auth.Auth#error-codes_12
export function hasErrorCode(error: any, code: string): boolean {
  return typeof error.code === "string" && (error.code as string) === code;
}
