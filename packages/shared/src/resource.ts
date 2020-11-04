export type ResourceKey =
  | "animal"
  | "animal_breed"
  | "blog"
  | "host_family"
  | "partner"
  | "user"
  | "user_role";

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
  animal_breed: "Races",
  blog: "Articles",
  host_family: "Familles d'accueil",
  partner: "Partenaires",
  user: "Utilisateurs",
  user_role: "Rôles utilisateurs",
};

// Sorted alphabetically by labels.
export const ResourceKeysOrder: ResourceKey[] = [
  "animal",
  "blog",
  "host_family",
  "partner",
  "animal_breed",
  "user_role",
  "user",
];
