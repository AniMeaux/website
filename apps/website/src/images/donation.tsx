import { ImageDescriptor } from "~/core/dataDisplay/image";
import donation1024 from "~/images/donation-1024w.png";
import donation1536 from "~/images/donation-1536w.png";
import donation2048 from "~/images/donation-2048w.png";
import donation512 from "~/images/donation-512w.png";

export const donationImages: ImageDescriptor = {
  alt: "De la monnaie dans un bocal.",
  imagesBySize: {
    "512": donation512,
    "1024": donation1024,
    "1536": donation1536,
    "2048": donation2048,
  },
};
