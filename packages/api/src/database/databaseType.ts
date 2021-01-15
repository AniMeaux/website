import {
  AnimalBreedFilters,
  CreateAnimalBreedPayload,
  CreateHostFamilyPayload,
  CreateUserPayload,
  DBAnimalBreed,
  DBHostFamily,
  HostFamilyFilters,
  PaginatedResponse,
  UpdateAnimalBreedPayload,
  UpdateHostFamilyPayload,
  UpdateUserPayload,
  User,
} from "@animeaux/shared-entities";

export type Database = {
  initialize(): void;

  //// User ////////////////////////////////////////////////////////////////////

  getUserForQueryContext(token: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | null>;
  createUser(payload: CreateUserPayload): Promise<User>;
  updateUser(currentUser: User, payload: UpdateUserPayload): Promise<User>;
  deleteUser(currentUser: User, id: string): Promise<boolean>;
  toggleUserBlockedStatus(currentUser: User, id: string): Promise<User>;

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
