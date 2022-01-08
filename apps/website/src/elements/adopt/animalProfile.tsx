import {
  AnimalSpecies,
  formatAge,
  PublicAnimal,
  Trilean,
} from "@animeaux/shared";
import { isDefined } from "core/isDefined";
import { ANIMAL_GENDER_LABELS } from "core/labels";
import { AnimalGenderIcon } from "dataDisplay/animalGenderIcon";
import { AnimalSpeciesIcon } from "dataDisplay/animalSpeciesIcon";
import { Markdown } from "dataDisplay/markdown";
import { CallToActionLink } from "layout/callToAction";
import { CenteredContent } from "layout/centeredContent";
import { Section } from "layout/section";
import { DateTime } from "luxon";
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
              <h1 className={styles.name}>{animal.displayName}</h1>

              <ul className={styles.details}>
                <li className={styles.detailItem}>
                  <AnimalSpeciesIcon
                    species={animal.species}
                    className={styles.detailIcon}
                  />
                  <span>
                    {[animal.breedName, animal.colorName]
                      .filter(isDefined)
                      .join(" • ")}
                  </span>
                </li>

                <li className={styles.detailItem}>
                  <AnimalGenderIcon
                    gender={animal.gender}
                    className={styles.detailIcon}
                  />
                  <span>{ANIMAL_GENDER_LABELS[animal.gender]}</span>
                </li>

                <li className={styles.detailItem}>
                  <FaBirthdayCake className={styles.detailIcon} />
                  <span>
                    {DateTime.fromISO(animal.birthdate).toLocaleString(
                      DateTime.DATE_FULL
                    )}{" "}
                    ({formatAge(animal.birthdate)})
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

              {animal.description != null && (
                <Markdown preset="paragraph">{animal.description}</Markdown>
              )}

              <CallToActionLink
                href="https://webquest.fr/?m=96315_formulaire-adoption-ani-meaux"
                color="blue"
                className={styles.callToAction}
                shouldOpenInNewTab
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
