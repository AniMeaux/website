import { Article } from "@animeaux/shared-entities/build/article";
import { formatLongDate } from "@animeaux/shared-entities/build/date";
import { StaticImage, useImageDominantColor } from "~/dataDisplay/image";
import { CenteredContent } from "~/layout/centeredContent";
import styles from "./articleHeader.module.css";

export type ArticleHeaderProps = {
  article: Article;
};

export function ArticleHeader({ article }: ArticleHeaderProps) {
  const [dominantColor] = useImageDominantColor({ src: article.image });

  return (
    <header style={{ backgroundColor: dominantColor?.withAlpha(0.1).toRgba() }}>
      <div className={styles.content}>
        <div className={styles.imageWrapper}>
          <StaticImage
            alt={article.title}
            largeImage={article.image}
            smallImage={article.image}
            className={styles.image}
          />
        </div>

        <CenteredContent>
          <div className={styles.info}>
            <h1 className={styles.title}>{article.title}</h1>

            <p>
              {formatLongDate(article.publicationDate)} par {article.authorName}
            </p>
          </div>
        </CenteredContent>
      </div>
    </header>
  );
}
