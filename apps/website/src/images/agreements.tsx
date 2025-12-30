import type { ImageDescriptor } from "#i/core/data-display/image";
import agreements1024 from "#i/images/agreements-1024w.png";
import agreements1536 from "#i/images/agreements-1536w.png";
import agreements2048 from "#i/images/agreements-2048w.png";
import agreements512 from "#i/images/agreements-512w.png";

export const agreementsImages: ImageDescriptor = {
  alt: "Chat errants dans une rue.",
  imagesBySize: {
    "512": agreements512,
    "1024": agreements1024,
    "1536": agreements1536,
    "2048": agreements2048,
  },
};
