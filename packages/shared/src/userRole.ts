export const ResourceKeysOrder = [
  "animal",
  "animal_breed",
  "animal_characteristic",
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
  animal_characteristic: false,
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
  animal_characteristic: "Charactéristiques animales",
  blog: "Blog",
  host_family: "Familles d'accueils",
  partner: "Partenaires",
  user: "Utilisateurs",
  user_role: "Rôles utilisateurs",
};

export type UserRole = {
  id: string;
  name: string;
  resourcePermissions: ResourcePermissions;
};

export type DBUserRole = {
  id: string;
  name: string;
  resourcePermissions: DBResourcePermissions;
};

export type CreateUserRolePayload = {
  name: string;
  resourcePermissions: ResourcePermissions;
};
