import {
  CloudinaryImage,
  StaticImage,
  useImageDominantColor,
} from "~/dataDisplay/image";
import { CenteredContent } from "~/layout/centeredContent";
import styles from "./secondaryHeader.module.css";

export type SecondaryHeaderProps = {
  image?: string;
  title: string;
  subTitle: string;
};

export function SecondaryHeader({
  image,
  title,
  subTitle,
}: SecondaryHeaderProps) {
  const isStatic = image?.startsWith("/");
  const [dominantColor] = useImageDominantColor(
    image == null ? null : isStatic ? { src: image } : { imageId: image }
  );

  return (
    <header
      style={{
        background:
          dominantColor?.withAlpha(0.2).toRgba() ?? "var(--blue-gradient)",
      }}
    >
      <div className={styles.content}>
        {image != null && (
          <div className={styles.imageWrapper}>
            {isStatic ? (
              <StaticImage
                alt={title}
                largeImage={image}
                smallImage={image}
                className={styles.image}
              />
            ) : (
              <CloudinaryImage
                alt={title}
                imageId={image}
                className={styles.image}
              />
            )}
          </div>
        )}

        <CenteredContent>
          <div className={styles.info}>
            <h1 className={styles.title}>{title}</h1>
            <p>{subTitle}</p>
          </div>
        </CenteredContent>
      </div>
    </header>
  );
}
