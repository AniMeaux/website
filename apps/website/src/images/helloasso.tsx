import type { ImageDescriptor } from "#i/core/data-display/image";
import helloasso1024 from "#i/images/helloasso-1024w.png";
import helloasso1536 from "#i/images/helloasso-1536w.png";
import helloasso2048 from "#i/images/helloasso-2048w.png";
import helloasso512 from "#i/images/helloasso-512w.png";

export const helloassoImages: ImageDescriptor = {
  alt: "Logo d’Helloasso.",
  imagesBySize: {
    "512": helloasso512,
    "1024": helloasso1024,
    "1536": helloasso1536,
    "2048": helloasso2048,
  },
};
