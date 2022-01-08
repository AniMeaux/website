import { UserGroup } from "@animeaux/shared";
import {
  AnimalFormDraftStorage,
  AnimalFormProvider,
  AnimalFormStep,
  AnimalFormStepper,
  useAnimalForm,
} from "animal/creation";
import { AnimalPicturesForm, FormValue } from "animal/picturesForm";
import { validate as validateProfile } from "animal/profileForm";
import { validate as validateSituation } from "animal/situationForm";
import { uploadImageFile } from "core/cloudinary";
import { getImageId, isImageFile } from "core/dataDisplay/image";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { useOperationMutation } from "core/operations";
import { PageTitle } from "core/pageTitle";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";
import { useMutation } from "react-query";

const CreateAnimalPicturesPage: PageComponent = () => {
  const { profileState, situationState, picturesState, setPicturesState } =
    useAnimalForm();
  const router = useRouter();

  const createAnimal = useOperationMutation("createAnimal", {
    onSuccess: (response, cache) => {
      // We no longer need the draft.
      AnimalFormDraftStorage.clear();

      cache.set(
        { name: "getAnimal", params: { id: response.result.id } },
        response.result
      );

      cache.invalidate({ name: "getAllActiveAnimals" });
      cache.invalidate({ name: "searchAnimals" });

      // 3 is the number of steps to create an animal.
      router.backIfPossible("../..", { historyOffset: 3 });
    },
  });

  const uploadImages = useMutation<void, Error, FormValue>(
    async (picturesValue) => {
      const profileValue = validateProfile(profileState);
      const situationValue = validateSituation(situationState);

      const pictures = [picturesValue.avatar]
        .concat(picturesValue.pictures)
        // It can only be an `ImageFile` when creating a new animal but we do
        // it for type checking (cast).
        .filter(isImageFile);

      await Promise.all(
        pictures.map((picture) =>
          uploadImageFile(picture, { tags: ["animal"] })
        )
      );

      createAnimal.mutate({
        ...profileValue,
        ...situationValue,
        avatarId: getImageId(picturesValue.avatar),
        picturesId: picturesValue.pictures.map(getImageId),
      });
    }
  );

  return (
    <ApplicationLayout>
      <PageTitle title="Nouvel animal" />

      <Header>
        <HeaderBackLink href="../situation" />
        <HeaderTitle>Nouvel animal</HeaderTitle>
      </Header>

      <Main>
        <AnimalFormStepper step={AnimalFormStep.PICTURES} />
        <AnimalPicturesForm
          state={picturesState}
          setState={setPicturesState}
          onSubmit={(value) => uploadImages.mutate(value)}
          pending={uploadImages.isLoading || createAnimal.state === "loading"}
          serverErrors={
            uploadImages.isError
              ? ["image-upload-error"]
              : createAnimal.state === "error"
              ? ["server-error"]
              : []
          }
        />
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

CreateAnimalPicturesPage.renderLayout = ({ children }) => {
  return <AnimalFormProvider>{children}</AnimalFormProvider>;
};

CreateAnimalPicturesPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default CreateAnimalPicturesPage;
