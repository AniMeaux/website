import { AnimalSpecies } from "@animeaux/shared";
import { AdoptSearchParams } from "core/adoptSearchParams";
import { createAdoptPage } from "elements/adopt/adoptPages";

const { getServerSideProps, AdoptPage } = createAdoptPage(
  new AdoptSearchParams({ animalSpecies: AnimalSpecies.REPTILE })
);

export { getServerSideProps };
export default AdoptPage;
