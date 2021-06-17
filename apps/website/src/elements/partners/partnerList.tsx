import { Partner } from "@animeaux/shared-entities/build/partner";
import { Link } from "core/link";
import { StaticImage } from "dataDisplay/image";
import styles from "./partnerList.module.css";

export type PartnerListProps = {
  partners: Partner[];
};

export function PartnerList({ partners }: PartnerListProps) {
  return (
    <ul className={styles.partners}>
      {partners.map((partner) => (
        <li key={partner.id}>
          <Link
            href={partner.url}
            shouldOpenInNewTab
            className={styles.partner}
          >
            <StaticImage
              largeImage={partner.image}
              smallImage={partner.image}
              alt={partner.name}
              className={styles.image}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
