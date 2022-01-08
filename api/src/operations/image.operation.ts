import { ImageOperations, UserGroup } from "@animeaux/shared";
import { object, string } from "yup";
import { assertUserHasGroups } from "../core/authentication";
import { cloudinary } from "../core/cloudinary";
import { OperationsImpl } from "../core/operations";
import { validateParams } from "../core/validation";

export const imageOperations: OperationsImpl<ImageOperations> = {
  async getCloudinaryApiSignature(rawParams, context) {
    assertUserHasGroups(context.currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const params = validateParams<"getCloudinaryApiSignature">(
      object({
        parametersToSign: object({
          id: string().required(),
          tags: string(),
        }).required(),
      }),
      rawParams
    );

    const timestamp = Date.now();

    return {
      timestamp: String(timestamp),
      signature: cloudinary.utils.api_sign_request(
        { timestamp, ...params.parametersToSign },
        process.env.CLOUDINARY_API_SECRET
      ),
    };
  },
};
