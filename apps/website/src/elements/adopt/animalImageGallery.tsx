import { PublicAnimal } from "@animeaux/shared-entities/build/animal";
import cn from "classnames";
import { CloudinaryImage, useImageDominantColor } from "dataDisplay/image";
import { useRef, useState } from "react";
import styles from "./animalImageGallery.module.css";

export type AnimalImageGalleryProps = {
  animal: PublicAnimal;
};

export function AnimalImageGallery({ animal }: AnimalImageGalleryProps) {
  const imagesId = [animal.avatarId].concat(animal.picturesId);
  const [visibleImageIndex, setVisibleImageIndex] = useState(0);
  const visibleImageId = imagesId[visibleImageIndex];
  const [dominantColor] = useImageDominantColor({ imageId: visibleImageId });
  const scrollContainer = useRef<HTMLDivElement>(null!);

  return (
    <section
      className={styles.imageGallery}
      style={{ backgroundColor: dominantColor?.withAlpha(0.2).toRgba() }}
    >
      <div className={styles.content}>
        <div
          className={styles.images}
          ref={scrollContainer}
          onScroll={(event) => {
            const imageWidth =
              event.currentTarget.scrollWidth / imagesId.length;

            const visibleImage = Math.round(
              event.currentTarget.scrollLeft / imageWidth
            );

            setVisibleImageIndex(visibleImage);
          }}
        >
          {imagesId.map((imageId) => (
            <CloudinaryImage
              key={imageId}
              imageId={imageId}
              alt={animal.officialName}
              className={styles.image}
            />
          ))}
        </div>

        <ul className={styles.thubnailItems}>
          {imagesId.map((imageId, index) => (
            <li key={imageId} className={styles.thubnailItem}>
              <button
                className={cn(styles.thubnailButton, {
                  [styles.active]: visibleImageIndex === index,
                })}
                onClick={() => {
                  const imageWidth =
                    scrollContainer.current.scrollWidth / imagesId.length;

                  scrollContainer.current.scrollTo(index * imageWidth, 0);
                }}
              >
                <CloudinaryImage
                  imageId={imageId}
                  alt={animal.officialName}
                  className={styles.thubnailImage}
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
