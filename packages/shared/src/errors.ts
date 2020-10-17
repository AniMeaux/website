// Authentication errors have a `code` attribute.
// See https://firebase.google.com/docs/reference/js/firebase.auth.Auth#error-codes_12
export function hasErrorCode(error: any, code: string): boolean {
  return typeof error.code === "string" && (error.code as string) === code;
}

export enum ErrorCode {
  USER_ROLE_MISSING_NAME = "user-role/missing-name",
  USER_ROLE_NAME_ALREADY_USED = "user-role/name-already-used",
}

const ErrorCodeLabels: { [key in ErrorCode]: string } = {
  [ErrorCode.USER_ROLE_MISSING_NAME]: "Le nom est obligatoire",
  [ErrorCode.USER_ROLE_NAME_ALREADY_USED]: "Le nom déjà utilisé",
};

export function getErrorMessage(error: Error): string {
  return ErrorCodeLabels[error.message as ErrorCode] ?? error.message;
}
