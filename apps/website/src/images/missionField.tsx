import type { ImageDescriptor } from "#core/dataDisplay/image.tsx";
import missionField512 from "#images/missionField-512w.png";

export const missionFieldImages: ImageDescriptor = {
  alt: "Chat enfermé dans une cage trappe.",
  imagesBySize: {
    "512": missionField512,
  },
};
