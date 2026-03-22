import { ImageUrl } from "@animeaux/core"
import invariant from "tiny-invariant"

import { services } from "#i/core/services.server.js"

invariant(
  process.env.CLOUDINARY_CLOUD_NAME,
  "CLOUDINARY_CLOUD_NAME should be defined",
)

const imageId = process.argv[2]
invariant(imageId != null, "Missing image id in command line.")

const blurhash = await services.blurhash.create(imageId)

console.log("Image blurhash:", blurhash)
console.log("Image URL:", ImageUrl.stringify({ id: imageId, blurhash }))
