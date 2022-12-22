import { User } from "@prisma/client";
import { AlgoliaClient } from "../core/algolia";

export const USER_INDEX_NAME = "users";

export const UserIndex = AlgoliaClient.initIndex(USER_INDEX_NAME);

export type UserFromAlgolia = Pick<
  User,
  "displayName" | "groups" | "isDisabled"
>;
