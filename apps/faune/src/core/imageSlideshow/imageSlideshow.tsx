import { Image } from "@animeaux/ui-library";
import * as React from "react";

type ImageSlideshowProps = {
  images: string[];
  alt: string;
};

export function ImageSlideshow({ images, alt }: ImageSlideshowProps) {
  return (
    <section className="ImageSlideshow">
      {images.map((pictureId, pictureIndex) => (
        <div key={pictureId} className="ImageSlideshow__item">
          <Image
            alt={`${alt} ${pictureIndex + 1}`}
            image={pictureId}
            className="ImageSlideshow__image"
          />

          {images.length > 1 && (
            <span className="ImageSlideshow__counter">
              {pictureIndex + 1}/{images.length}
            </span>
          )}
        </div>
      ))}
    </section>
  );
}
