import type { ImageDescriptor } from "#core/dataDisplay/image";
import questions1024 from "#images/questions-1024w.png";
import questions1536 from "#images/questions-1536w.png";
import questions2048 from "#images/questions-2048w.png";
import questions512 from "#images/questions-512w.png";

export const questionsImages: ImageDescriptor = {
  alt: "Chien qui lève la patte.",
  imagesBySize: {
    "512": questions512,
    "1024": questions1024,
    "1536": questions1536,
    "2048": questions2048,
  },
};
