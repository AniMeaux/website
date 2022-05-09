import { ImageOperations, UserGroup } from "@animeaux/shared";
import invariant from "tiny-invariant";
import { object, string } from "yup";
import { assertUserHasGroups, getCurrentUser } from "../core/authentication";
import { cloudinary } from "../core/cloudinary";
import { OperationsImpl } from "../core/operations";
import { validateParams } from "../core/validation";

invariant(
  process.env.CLOUDINARY_API_SECRET != null,
  "CLOUDINARY_API_SECRET must be defined."
);

const secret = process.env.CLOUDINARY_API_SECRET;

export const imageOperations: OperationsImpl<ImageOperations> = {
  async getCloudinaryApiSignature(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
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
        {
          timestamp,
          public_id: params.parametersToSign.id,
          tags: params.parametersToSign.tags,
        },
        secret
      ),
    };
  },
};
