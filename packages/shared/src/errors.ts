// Authentication errors have a `code` attribute.
// See https://firebase.google.com/docs/reference/js/firebase.auth.Auth#error-codes_12
export function getErrorCode(error: Error): ErrorCode {
  return ((error as any).code ?? error.message) as ErrorCode;
}

export function hasErrorCode(
  error: Error,
  expectedCodes: ErrorCode | ErrorCode[]
): boolean {
  if (!Array.isArray(expectedCodes)) {
    expectedCodes = [expectedCodes];
  }

  return expectedCodes.includes(getErrorCode(error));
}

export enum ErrorCode {
  //// Authentication //////////////////////////////////////////////////////////

  AUTH_INVALID_EMAIL = "auth/invalid-email",
  AUTH_NOT_AUTHENTICATED = "auth/not-authenticated",
  AUTH_NOT_AUTHORIZED = "auth/not-authorized",
  AUTH_USER_DISABLED = "auth/user-disabled",
  AUTH_USER_NOT_FOUND = "auth/user-not-found",
  AUTH_WEEK_PASSWORD = "auth/weak-password",
  AUTH_WRONG_PASSWORD = "auth/wrong-password",

  //// User Role ///////////////////////////////////////////////////////////////

  USER_ROLE_NOT_FOUND = "user-role/not-found",
  USER_ROLE_MISSING_NAME = "user-role/missing-name",
  USER_ROLE_NAME_ALREADY_USED = "user-role/name-already-used",
  USER_ROLE_IS_REFERENCED = "user-role/is-referenced",

  //// User ////////////////////////////////////////////////////////////////////

  USER_NOT_FOUND = "user/not-found",
  USER_MISSING_DISPLAY_NAME = "user/missing-display-name",
  USER_INVALID_EMAIL = "user/invalid-email",
  USER_EMAIL_ALREADY_EXISTS = "auth/email-already-exists",
  USER_MISSING_ROLE = "user/missing-role",
  USER_INVALID_PASSWORD = "auth/invalid-password",
  USER_IS_REFERENCED = "user/is-referenced",
  USER_IS_CURRENT_USER = "user/is-current-user",
}

const ErrorCodeLabels: { [key in ErrorCode]?: string } = {
  //// Authentication //////////////////////////////////////////////////////////

  [ErrorCode.AUTH_WEEK_PASSWORD]:
    "Le mot de passe doit avoir au moins 6 caractères",
  [ErrorCode.AUTH_WRONG_PASSWORD]: "Le mot de passe est invalide",

  //// User Role ///////////////////////////////////////////////////////////////

  [ErrorCode.USER_ROLE_NOT_FOUND]: "Le rôle utilisateur est introuvable",
  [ErrorCode.USER_ROLE_MISSING_NAME]: "Le nom est obligatoire",
  [ErrorCode.USER_ROLE_NAME_ALREADY_USED]: "Le nom déjà utilisé",
  [ErrorCode.USER_ROLE_IS_REFERENCED]:
    "Le rôle utilisateur ne peut pas être supprimé parce qu'il est utilisé par au moins un utilisateur",

  //// User ////////////////////////////////////////////////////////////////////

  [ErrorCode.USER_NOT_FOUND]: "L'utilisateur est introuvable",
  [ErrorCode.USER_MISSING_DISPLAY_NAME]: "Le nom est obligatoire",
  [ErrorCode.USER_INVALID_EMAIL]: "Le format de l'email est invalide",
  [ErrorCode.USER_EMAIL_ALREADY_EXISTS]: "L'email est déjà utilisé",
  [ErrorCode.USER_MISSING_ROLE]: "Le rôle est obligatoire",
  [ErrorCode.USER_INVALID_PASSWORD]:
    "Le mot de passe doit avoir au moins 6 caractères",
  [ErrorCode.USER_IS_REFERENCED]:
    "L'utilisateur ne peut pas être supprimé parce qu'il est référencé par au moins un article",
  [ErrorCode.USER_IS_CURRENT_USER]:
    "Vous ne pouvez pas supprimer ou bloquer votre propre utilisateur",
};

export function getErrorMessage(error: Error): string {
  return ErrorCodeLabels[getErrorCode(error)] ?? error.message;
}
