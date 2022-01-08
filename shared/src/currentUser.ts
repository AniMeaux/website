import { OperationErrorResult } from "./operationError";
import { User } from "./user";

export type CurrentUserOperations = {
  getCurrentUser: () => User | null;
  updateCurrentUserProfile: (params: { displayName: string }) => User;
  updateCurrentUserPassword: (params: {
    password: string;
  }) => boolean | OperationErrorResult<"week-password">;
};
