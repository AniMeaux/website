import type { ImageDescriptor } from "#core/dataDisplay/image";
import error1024 from "#images/error-1024w.png";
import error1536 from "#images/error-1536w.png";
import error2048 from "#images/error-2048w.png";
import error512 from "#images/error-512w.png";

export const errorImages: ImageDescriptor = {
  alt: "Chien qui se cache dans l’herbe.",
  imagesBySize: {
    "512": error512,
    "1024": error1024,
    "1536": error1536,
    "2048": error2048,
  },
};
