import { ImageDescriptor } from "#core/dataDisplay/image.tsx";
import followUp1024 from "#images/followUp-1024w.png";
import followUp1536 from "#images/followUp-1536w.png";
import followUp2048 from "#images/followUp-2048w.png";
import followUp512 from "#images/followUp-512w.png";

export const followUpImages: ImageDescriptor = {
  alt: "Chien portant des lunettes derrière un écran d’ordinateur.",
  imagesBySize: {
    "512": followUp512,
    "1024": followUp1024,
    "1536": followUp1536,
    "2048": followUp2048,
  },
};
