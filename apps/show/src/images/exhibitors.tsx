import { ImageDescriptor } from "~/dataDisplay/image";
import exhibitors1024 from "~/images/exhibitors-1024w.png";
import exhibitors512 from "~/images/exhibitors-512w.png";

export const exhibitorsImages: ImageDescriptor = {
  alt: "Visiteurs marchant dans les allées du Salon des Ani’Meaux.",
  imagesBySize: {
    "512": exhibitors512,
    "1024": exhibitors1024,
  },
};
