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

  //// User ////////////////////////////////////////////////////////////////////

  USER_NOT_FOUND = "user/not-found",
  USER_MISSING_DISPLAY_NAME = "user/missing-display-name",
  USER_INVALID_EMAIL = "user/invalid-email",
  USER_EMAIL_ALREADY_EXISTS = "auth/email-already-exists",
  USER_MISSING_GROUP = "user/missing-group",
  USER_INVALID_PASSWORD = "auth/invalid-password",
  USER_IS_REFERENCED = "user/is-referenced",
  USER_IS_CURRENT_USER = "user/is-current-user",
  USER_IS_ADMIN = "user/is-admin",

  //// Animal Breed ////////////////////////////////////////////////////////////

  ANIMAL_BREED_NOT_FOUND = "animal-breed/not-found",
  ANIMAL_BREED_MISSING_NAME = "animal-breed/missing-name",
  ANIMAL_BREED_MISSING_SPECIES = "animal-breed/missing-species",
  ANIMAL_BREED_ALREADY_EXIST = "animal-breed/name-already-used",
  ANIMAL_BREED_IS_REFERENCED = "animal-breed/is-referenced",

  //// Host Family /////////////////////////////////////////////////////////////

  HOST_FAMILY_NOT_FOUND = "host-family/not-found",
  HOST_FAMILY_MISSING_NAME = "host-family/missing-name",
  HOST_FAMILY_MISSING_ADDRESS = "host-family/missing-address",
  HOST_FAMILY_MISSING_PHONE = "host-family/missing-phone",
  HOST_FAMILY_NAME_ALREADY_USED = "host-family/name-already-used",
  HOST_FAMILY_IS_REFERENCED = "host-family/is-referenced",
}

const ErrorCodeLabels: { [key in ErrorCode]?: string } = {
  //// Authentication //////////////////////////////////////////////////////////

  [ErrorCode.AUTH_WEEK_PASSWORD]:
    "Le mot de passe doit avoir au moins 6 caractères",
  [ErrorCode.AUTH_WRONG_PASSWORD]: "Le mot de passe est invalide",

  //// User ////////////////////////////////////////////////////////////////////

  [ErrorCode.USER_NOT_FOUND]: "L'utilisateur est introuvable",
  [ErrorCode.USER_MISSING_DISPLAY_NAME]: "Le nom est obligatoire",
  [ErrorCode.USER_INVALID_EMAIL]: "Le format de l'email est invalide",
  [ErrorCode.USER_EMAIL_ALREADY_EXISTS]: "L'email est déjà utilisé",
  [ErrorCode.USER_MISSING_GROUP]: "L'utilisateur doit avoir au moins 1 groupe",
  [ErrorCode.USER_INVALID_PASSWORD]:
    "Le mot de passe doit avoir au moins 6 caractères",
  [ErrorCode.USER_IS_REFERENCED]:
    "L'utilisateur ne peut pas être supprimé parce qu'il est référencé par au moins un article",
  [ErrorCode.USER_IS_CURRENT_USER]:
    "Vous ne pouvez pas supprimer ou bloquer votre propre utilisateur",
  [ErrorCode.USER_IS_ADMIN]:
    "Vous ne pouvez pas vous retirer du group Administrateur",

  //// Animal Breed ////////////////////////////////////////////////////////////

  [ErrorCode.ANIMAL_BREED_NOT_FOUND]: "La race est introuvable",
  [ErrorCode.ANIMAL_BREED_MISSING_NAME]: "Le nom est obligatoire",
  [ErrorCode.ANIMAL_BREED_ALREADY_EXIST]: "Cette race existe déjà",
  [ErrorCode.ANIMAL_BREED_MISSING_SPECIES]: "L'espèce est obligatoire",
  [ErrorCode.ANIMAL_BREED_IS_REFERENCED]:
    "La race ne peut pas être supprimée parce qu'elle est référencée par au moins un animal",

  //// Host Family /////////////////////////////////////////////////////////////

  [ErrorCode.HOST_FAMILY_NOT_FOUND]: "La famille d'accueil est introuvable",
  [ErrorCode.HOST_FAMILY_MISSING_NAME]: "Le nom est obligatoire",
  [ErrorCode.HOST_FAMILY_MISSING_ADDRESS]: "L'adresse est obligatoire",
  [ErrorCode.HOST_FAMILY_MISSING_PHONE]:
    "Le numéro de téléphone est obligatoire",
  [ErrorCode.HOST_FAMILY_NAME_ALREADY_USED]: "Le nom est déjà utilisé",
  [ErrorCode.HOST_FAMILY_IS_REFERENCED]:
    "La famille d'accueil ne peut pas être supprimée parce qu'elle est référencée par au moins un animal",
};

export function getErrorMessage(error: Error): string {
  return ErrorCodeLabels[getErrorCode(error)] ?? error.message;
}
