// Authentication errors have a `code` attribute.
// See https://firebase.google.com/docs/reference/js/firebase.auth.Auth#error-codes_12
export function getErrorCode(error: Error): ErrorCode {
  return ((error as any).code ?? error.message) as ErrorCode;
}

export function hasErrorCode(error: Error, expectedCode: ErrorCode): boolean {
  return getErrorCode(error) === expectedCode;
}

export enum ErrorCode {
  AUTH_INVALID_EMAIL = "auth/invalid-email",
  AUTH_NOT_AUTHENTICATED = "auth/not-authenticated",
  AUTH_NOT_AUTHORIZED = "auth/not-authorized",
  AUTH_USER_DISABLED = "auth/user-disabled",
  AUTH_USER_NOT_FOUND = "auth/user-not-found",
  AUTH_WEEK_PASSWORD = "auth/weak-password",
  AUTH_WRONG_PASSWORD = "auth/wrong-password",
  USER_ROLE_MISSING_NAME = "user-role/missing-name",
  USER_ROLE_NAME_ALREADY_USED = "user-role/name-already-used",
  USER_ROLE_NOT_FOUND = "user-role/not-found",
}

const ErrorCodeLabels: { [key in ErrorCode]?: string } = {
  [ErrorCode.AUTH_WEEK_PASSWORD]:
    "Le mot de passe doit avoir au moins 6 caractères",
  [ErrorCode.AUTH_WRONG_PASSWORD]: "Le mot de passe est invalide",
  [ErrorCode.USER_ROLE_MISSING_NAME]: "Le nom est obligatoire",
  [ErrorCode.USER_ROLE_NAME_ALREADY_USED]: "Le nom déjà utilisé",
  [ErrorCode.USER_ROLE_NOT_FOUND]: "Le rôle utilisateur est introuvable",
};

export function getErrorMessage(error: Error): string {
  return ErrorCodeLabels[getErrorCode(error)] ?? error.message;
}
