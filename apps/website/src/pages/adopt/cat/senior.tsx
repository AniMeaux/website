import {
  AnimalAge,
  AnimalSpecies,
} from "@animeaux/shared-entities/build/animal";
import { AdoptSearchParams } from "~/core/adoptSearchParams";
import { createAdoptPage } from "~/elements/adopt/adoptPages";

const { getServerSideProps, AdoptPage } = createAdoptPage(
  new AdoptSearchParams({
    animalSpecies: AnimalSpecies.CAT,
    animalAge: AnimalAge.SENIOR,
  })
);

export { getServerSideProps };
export default AdoptPage;
