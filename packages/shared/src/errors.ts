// Authentication errors have a `code` attribute.
// See https://firebase.google.com/docs/reference/js/firebase.auth.Auth#error-codes_12
export function hasErrorCode(error: any, code: string): boolean {
  return typeof error.code === "string" && (error.code as string) === code;
}

export enum ErrorCode {
  AUTH_NOT_AUTHENTICATED = "auth/not-authenticated",
  AUTH_NOT_AUTHORIZED = "auth/not-authorized",
  USER_ROLE_MISSING_NAME = "user-role/missing-name",
  USER_ROLE_NAME_ALREADY_USED = "user-role/name-already-used",
  USER_ROLE_NOT_FOUND = "user-role/not-found",
}

const ErrorCodeLabels: { [key in ErrorCode]: string } = {
  [ErrorCode.AUTH_NOT_AUTHENTICATED]: "",
  [ErrorCode.AUTH_NOT_AUTHORIZED]: "",
  [ErrorCode.USER_ROLE_MISSING_NAME]: "Le nom est obligatoire",
  [ErrorCode.USER_ROLE_NAME_ALREADY_USED]: "Le nom déjà utilisé",
  [ErrorCode.USER_ROLE_NOT_FOUND]: "Le rôle utilisateur est introuvable",
};

export function getErrorMessage(error: Error): string {
  return ErrorCodeLabels[error.message as ErrorCode] ?? error.message;
}
