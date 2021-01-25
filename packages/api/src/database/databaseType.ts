import {
  AnimalBreedFilters,
  CreateAnimalBreedPayload,
  CreateHostFamilyPayload,
  CreateUserPayload,
  AnimalBreed,
  DBHostFamily,
  HostFamilyFilters,
  PaginatedResponse,
  UpdateAnimalBreedPayload,
  UpdateHostFamilyPayload,
  UpdateUserPayload,
  User,
} from "@animeaux/shared-entities";

export type DatabaseCore = {
  initialize(): void;
};

export type UserDatabase = {
  getUserForQueryContext(token: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | null>;
  createUser(payload: CreateUserPayload): Promise<User>;
  updateUser(currentUser: User, payload: UpdateUserPayload): Promise<User>;
  deleteUser(currentUser: User, id: string): Promise<boolean>;
  toggleUserBlockedStatus(currentUser: User, id: string): Promise<User>;
};

export type AnimalBreedDatabase = {
  getAllAnimalBreeds(
    filters: AnimalBreedFilters
  ): Promise<PaginatedResponse<AnimalBreed>>;
  getAnimalBreed(id: string): Promise<AnimalBreed | null>;
  createAnimalBreed(payload: CreateAnimalBreedPayload): Promise<AnimalBreed>;
  updateAnimalBreed(payload: UpdateAnimalBreedPayload): Promise<AnimalBreed>;
  deleteAnimalBreed(id: string): Promise<boolean>;
};

export type HostFamilyDatabase = {
  getAllHostFamilies(
    filters: HostFamilyFilters
  ): Promise<PaginatedResponse<DBHostFamily>>;
  getHostFamily(id: string): Promise<DBHostFamily | null>;
  createHostFamily(payload: CreateHostFamilyPayload): Promise<DBHostFamily>;
  updateHostFamily(payload: UpdateHostFamilyPayload): Promise<DBHostFamily>;
  deleteHostFamily(id: string): Promise<boolean>;
};

export type Database = DatabaseCore &
  UserDatabase &
  AnimalBreedDatabase &
  HostFamilyDatabase;
