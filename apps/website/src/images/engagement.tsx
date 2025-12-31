import type { ImageDescriptor } from "#i/core/data-display/image";
import engagement1024 from "#i/images/engagement-1024w.png";
import engagement1536 from "#i/images/engagement-1536w.png";
import engagement2048 from "#i/images/engagement-2048w.png";
import engagement512 from "#i/images/engagement-512w.png";

export const engagementImages: ImageDescriptor = {
  alt: "Chat faisant un high five à un humain.",
  imagesBySize: {
    "512": engagement512,
    "1024": engagement1024,
    "1536": engagement1536,
    "2048": engagement2048,
  },
};
