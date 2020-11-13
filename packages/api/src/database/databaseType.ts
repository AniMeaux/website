import {
  AnimalBreedFilters,
  CreateAnimalBreedPayload,
  CreateHostFamilyPayload,
  CreateUserPayload,
  CreateUserRolePayload,
  DBAnimalBreed,
  DBHostFamily,
  DBUser,
  DBUserForQueryContext,
  DBUserRole,
  HostFamilyFilters,
  PaginatedResponse,
  UpdateAnimalBreedPayload,
  UpdateHostFamilyPayload,
  UpdateUserPayload,
  UpdateUserRolePayload,
  UserFilters,
} from "@animeaux/shared";

export type Database = {
  initialize(): void;

  //// User Role ///////////////////////////////////////////////////////////////

  getAllUserRoles(): Promise<DBUserRole[]>;
  getUserRole(id: string): Promise<DBUserRole | null>;
  createUserRole(payload: CreateUserRolePayload): Promise<DBUserRole>;
  updateUserRole(payload: UpdateUserRolePayload): Promise<DBUserRole>;
  deleteUserRole(id: string): Promise<boolean>;

  //// User ////////////////////////////////////////////////////////////////////

  getUserForQueryContext(token: string): Promise<DBUserForQueryContext | null>;
  getAllUsers(
    currentUser: DBUserForQueryContext,
    filters?: UserFilters
  ): Promise<DBUser[]>;
  getUser(
    currentUser: DBUserForQueryContext,
    id: string
  ): Promise<DBUser | null>;
  createUser(payload: CreateUserPayload): Promise<DBUser>;
  updateUser(
    currentUser: DBUserForQueryContext,
    payload: UpdateUserPayload
  ): Promise<DBUser>;
  deleteUser(currentUser: DBUserForQueryContext, id: string): Promise<boolean>;
  toggleUserBlockedStatus(
    currentUser: DBUserForQueryContext,
    id: string
  ): Promise<DBUser>;

  //// Animal Breed ////////////////////////////////////////////////////////////

  getAllAnimalBreeds(
    filters: AnimalBreedFilters
  ): Promise<PaginatedResponse<DBAnimalBreed>>;
  getAnimalBreed(id: string): Promise<DBAnimalBreed | null>;
  createAnimalBreed(payload: CreateAnimalBreedPayload): Promise<DBAnimalBreed>;
  updateAnimalBreed(payload: UpdateAnimalBreedPayload): Promise<DBAnimalBreed>;
  deleteAnimalBreed(id: string): Promise<boolean>;

  //// Host Family /////////////////////////////////////////////////////////////

  getAllHostFamilies(
    filters: HostFamilyFilters
  ): Promise<PaginatedResponse<DBHostFamily>>;
  getHostFamily(id: string): Promise<DBHostFamily | null>;
  createHostFamily(payload: CreateHostFamilyPayload): Promise<DBHostFamily>;
  updateHostFamily(payload: UpdateHostFamilyPayload): Promise<DBHostFamily>;
  deleteHostFamily(id: string): Promise<boolean>;
};
