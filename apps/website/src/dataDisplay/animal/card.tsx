import { PublicSearchableAnimal } from "@animeaux/shared-entities/build/animal";
import { formatAge } from "@animeaux/shared-entities/build/date";
import cn from "classnames";
import { isDefined } from "core/isDefined";
import { Link, LinkProps } from "core/link";
import { StyleProps } from "core/types";
import { AnimalGenderIcon } from "dataDisplay/animalGenderIcon";
import { CloudinaryImage } from "dataDisplay/image";
import styles from "./card.module.css";

type AnimalCardContentProps = {
  animal: PublicSearchableAnimal;
};

function AnimalCardContent({ animal }: AnimalCardContentProps) {
  const speciesLabels = [animal.breed?.name, animal.color?.name]
    .filter(isDefined)
    .join(" • ");

  return (
    <>
      <CloudinaryImage
        imageId={animal.avatarId}
        alt={animal.officialName}
        className={styles.avatar}
      />

      <div className={styles.info}>
        <div className={styles.infoRow}>
          <h2 className={styles.name}>{animal.officialName}</h2>
          <p className={styles.age}>{formatAge(animal.birthdate)}</p>
        </div>

        <div className={cn(styles.infoRow, styles.details)}>
          <p>{speciesLabels}</p>
          <span className={styles.genderIcon}>
            <AnimalGenderIcon gender={animal.gender} />
          </span>
        </div>
      </div>
    </>
  );
}

export type AnimalLinkCardProps = LinkProps & AnimalCardContentProps;
export function AnimalLinkCard({
  animal,
  className,
  ...rest
}: AnimalLinkCardProps) {
  return (
    <Link {...rest} className={cn(styles.animalCard, styles.action, className)}>
      <AnimalCardContent animal={animal} />
    </Link>
  );
}

export type AnimalCardProps = StyleProps & AnimalCardContentProps;
export function AnimalCard({ animal, className, ...rest }: AnimalCardProps) {
  return (
    <span {...rest} className={cn(styles.animalCard, className)}>
      <AnimalCardContent animal={animal} />
    </span>
  );
}
