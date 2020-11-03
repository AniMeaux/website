import { User } from "./user";

export const ResourceKeysOrder = [
  "animal",
  "animal_breed",
  "blog",
  "host_family",
  "partner",
  "user",
  "user_role",
] as const;

export type ResourceKey = typeof ResourceKeysOrder[number];

export type ResourcePermissions = {
  [key in ResourceKey]: boolean;
};

export type DBResourcePermissions = {
  [key in ResourceKey]?: boolean;
};

export const DEFAULT_RESOURCE_PERMISSIONS: ResourcePermissions = {
  animal: false,
  animal_breed: false,
  blog: false,
  host_family: false,
  partner: false,
  user: false,
  user_role: false,
};

export const ResourceLabels: {
  [key in ResourceKey]: string;
} = {
  animal: "Animaux",
  animal_breed: "Races animales",
  blog: "Articles",
  host_family: "Familles d'accueil",
  partner: "Partenaires",
  user: "Utilisateurs",
  user_role: "Rôles utilisateurs",
};

export type UserRole = {
  id: string;
  name: string;
  resourcePermissions: ResourcePermissions;
  users: User[];
};

export type DBUserRole = {
  id: string;
  name: string;
  resourcePermissions: DBResourcePermissions;
};

export type UserRoleFormPayload = {
  name: string;
  resourcePermissions: ResourcePermissions;
};

export type CreateUserRolePayload = {
  name: string;
  resourcePermissions: ResourcePermissions;
};

export type UpdateUserRolePayload = {
  id: string;
  name?: string;
  resourcePermissions?: ResourcePermissions;
};
