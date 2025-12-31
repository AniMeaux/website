import type { ImageDescriptor } from "#i/core/data-display/image";
import hero1024 from "#i/images/hero-1024w.png";
import hero1536 from "#i/images/hero-1536w.png";
import hero2048 from "#i/images/hero-2048w.png";
import hero512 from "#i/images/hero-512w.png";

export const heroImages: ImageDescriptor = {
  alt: "Chien alongé dans l’herbe, tirant la langue.",
  imagesBySize: {
    "512": hero512,
    "1024": hero1024,
    "1536": hero1536,
    "2048": hero2048,
  },
};
