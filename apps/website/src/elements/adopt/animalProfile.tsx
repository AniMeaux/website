import {
  AnimalGenderLabels,
  AnimalSpecies,
  PublicAnimal,
} from "@animeaux/shared-entities/build/animal";
import {
  formatAge,
  formatLongDate,
} from "@animeaux/shared-entities/build/date";
import { Trilean } from "@animeaux/shared-entities/build/trilean";
import { isDefined } from "core/isDefined";
import { AnimalGenderIcon } from "dataDisplay/animalGenderIcon";
import { AnimalSpeciesIcon } from "dataDisplay/animalSpeciesIcon";
import { Markdown } from "dataDisplay/markdown";
import { CallToActionLink } from "layout/callToAction";
import { CenteredContent } from "layout/centeredContent";
import { Section } from "layout/section";
import { FaBaby, FaBirthdayCake } from "react-icons/fa";
import { AnimalImageGallery } from "./animalImageGallery";
import styles from "./animalProfile.module.css";

export type AnimalProfileProps = {
  animal: PublicAnimal;
};

export function AnimalProfile({ animal }: AnimalProfileProps) {
  return (
    <div className={styles.profileSection}>
      <AnimalImageGallery animal={animal} />

      <section className={styles.descriptionItem}>
        <Section>
          <CenteredContent>
            <div>
              <h1 className={styles.name}>{animal.officialName}</h1>

              <ul className={styles.details}>
                <li className={styles.detailItem}>
                  <AnimalSpeciesIcon
                    species={animal.species}
                    className={styles.detailIcon}
                  />
                  <span>
                    {[animal.breed?.name, animal.color?.name]
                      .filter(isDefined)
                      .join(" • ")}
                  </span>
                </li>

                <li className={styles.detailItem}>
                  <AnimalGenderIcon
                    gender={animal.gender}
                    className={styles.detailIcon}
                  />
                  <span>{AnimalGenderLabels[animal.gender]}</span>
                </li>

                <li className={styles.detailItem}>
                  <FaBirthdayCake className={styles.detailIcon} />
                  <span>
                    {formatLongDate(animal.birthdate)} (
                    {formatAge(animal.birthdate)})
                  </span>
                </li>

                {animal.isOkChildren === Trilean.TRUE && (
                  <li className={styles.detailItem}>
                    <FaBaby className={styles.detailIcon} />
                    <span>S'entend avec les enfants</span>
                  </li>
                )}

                {animal.isOkCats === Trilean.TRUE && (
                  <li className={styles.detailItem}>
                    <AnimalSpeciesIcon
                      species={AnimalSpecies.CAT}
                      className={styles.detailIcon}
                    />
                    <span>S'entend avec les chats</span>
                  </li>
                )}

                {animal.isOkDogs === Trilean.TRUE && (
                  <li className={styles.detailItem}>
                    <AnimalSpeciesIcon
                      species={AnimalSpecies.DOG}
                      className={styles.detailIcon}
                    />
                    <span>S'entend avec les chiens</span>
                  </li>
                )}
              </ul>

              <Markdown preset="paragraph" className={styles.description}>
                {animal.description}
              </Markdown>

              <CallToActionLink
                href="https://webquest.fr/?m=96315_formulaire-adoption-ani-meaux"
                color="blue"
                className={styles.callToAction}
              >
                Je l'adopte !
              </CallToActionLink>
            </div>
          </CenteredContent>
        </Section>
      </section>
    </div>
  );
}
