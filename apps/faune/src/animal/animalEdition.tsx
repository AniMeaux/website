import {
  AdoptionOption,
  AnimalFormPayload,
  createEmptyAnimalFormPayload,
} from "@animeaux/shared-entities";
import { useAnimal } from "animal/queries";
import constate from "constate";
import { useRouter } from "core/router";
import { useEffect, useState } from "react";

function useAnimalFormPayload() {
  const router = useRouter();
  const animalId = router.query.animalId as string;
  const query = useAnimal(animalId);
  const animal = query.data;

  const [formPayload, setFormPayload] = useState<AnimalFormPayload>(() =>
    createEmptyAnimalFormPayload()
  );

  useEffect(() => {
    if (animal != null) {
      setFormPayload({
        officialName: animal.officialName,
        commonName: animal.commonName,
        birthdate: animal.birthdate,
        gender: animal.gender,
        species: animal.species,
        breed: animal.breed ?? null,
        color: animal.color ?? null,
        description: animal.description,
        iCadNumber: animal.iCadNumber ?? "",
        hostFamily: animal.hostFamily ?? null,
        isOkCats: animal.isOkCats,
        isOkChildren: animal.isOkChildren,
        isOkDogs: animal.isOkDogs,
        isSterilized: animal.isSterilized,
        pickUpDate: animal.pickUpDate,
        pickUpLocation: animal.pickUpLocation ?? null,
        pickUpReason: animal.pickUpReason,
        status: animal.status,
        adoptionDate: animal.adoptionDate ?? "",
        adoptionOption: animal.adoptionOption ?? AdoptionOption.UNKNOWN,
        comments: animal.comments,
        pictures: [animal.avatarId].concat(animal.picturesId),
      });
    }
  }, [animal]);

  return { formPayload, setFormPayload };
}

const [AnimalFormProvider, useAnimalForm] = constate(useAnimalFormPayload);

export { AnimalFormProvider, useAnimalForm };
