import { AnimalAge, AnimalSpecies } from "@animeaux/shared";
import { AdoptSearchParams } from "~/core/adoptSearchParams";
import { createAdoptPage } from "~/elements/adopt/adoptPages";

const { getServerSideProps, AdoptPage } = createAdoptPage(
  new AdoptSearchParams({
    animalSpecies: AnimalSpecies.DOG,
    animalAge: AnimalAge.ADULT,
  })
);

export { getServerSideProps };
export default AdoptPage;
