import { Article } from "@animeaux/shared-entities/build/article";
import { Link } from "core/link";
import { StaticImage } from "dataDisplay/image";
import styles from "./articleList.module.css";

export type ArticleListProps = {
  articles: Article[];
};

export function ArticleList({ articles }: ArticleListProps) {
  return (
    <ul className={styles.articles}>
      {articles.map((article) => (
        <li key={article.id}>
          <Link href={article.slug} className={styles.article}>
            <StaticImage
              largeImage={article.image}
              smallImage={article.image}
              alt={article.title}
              className={styles.image}
            />

            <div className={styles.info}>
              <h2 className={styles.name}>{article.title}</h2>
              <p>{article.description}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
