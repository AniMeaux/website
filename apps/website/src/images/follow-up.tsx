import type { ImageDescriptor } from "#core/data-display/image";
import followUp1024 from "#images/follow-up-1024w.png";
import followUp1536 from "#images/follow-up-1536w.png";
import followUp2048 from "#images/follow-up-2048w.png";
import followUp512 from "#images/follow-up-512w.png";

export const followUpImages: ImageDescriptor = {
  alt: "Chien portant des lunettes derrière un écran d’ordinateur.",
  imagesBySize: {
    "512": followUp512,
    "1024": followUp1024,
    "1536": followUp1536,
    "2048": followUp2048,
  },
};
