import { OperationParams, UserGroup } from "@animeaux/shared";
import invariant from "invariant";
import difference from "lodash.difference";
import { useMutation } from "react-query";
import { AnimalFormProvider, useAnimalForm } from "~/animal/edition";
import { AnimalPicturesForm, FormValue } from "~/animal/picturesForm";
import { deleteImage, uploadImageFile } from "~/core/cloudinary";
import { getImageId, isImageFile } from "~/core/dataDisplay/image";
import { ApplicationLayout } from "~/core/layouts/applicationLayout";
import { ErrorPage } from "~/core/layouts/errorPage";
import { Header, HeaderBackLink, HeaderTitle } from "~/core/layouts/header";
import { Main } from "~/core/layouts/main";
import { Navigation } from "~/core/layouts/navigation";
import { Placeholder } from "~/core/loaders/placeholder";
import { useOperationMutation, useOperationQuery } from "~/core/operations";
import { PageTitle } from "~/core/pageTitle";
import { useRouter } from "~/core/router";
import { PageComponent } from "~/core/types";

const UpdateAnimalPicturesPage: PageComponent = () => {
  const router = useRouter();

  invariant(
    typeof router.query.animalId === "string",
    `The animalId path should be a string. Got '${typeof router.query
      .animalId}'`
  );

  const getAnimal = useOperationQuery({
    name: "getAnimal",
    params: { id: router.query.animalId },
  });

  const deleteImages = useMutation<
    void,
    Error,
    OperationParams<"updateAnimalPictures">
  >(
    async (params) => {
      invariant(
        getAnimal.state === "success",
        "Can delete images only if an animal was found."
      );

      const picturesToDelete = difference(
        [getAnimal.result.avatarId].concat(getAnimal.result.picturesId),
        [params.avatarId].concat(params.picturesId)
      );

      if (picturesToDelete.length > 0) {
        await Promise.all(
          picturesToDelete.map((pictureId) => deleteImage(pictureId))
        );
      }
    },
    { onSettled: () => router.backIfPossible("../..") }
  );

  const updateAnimalPictures = useOperationMutation("updateAnimalPictures", {
    onSuccess: (response, cache) => {
      deleteImages.mutate(response.body.params);

      cache.set(
        { name: "getAnimal", params: { id: response.result.id } },
        response.result
      );

      cache.invalidate({ name: "getAllActiveAnimals" });
      cache.invalidate({ name: "searchAnimals" });
    },
  });

  const uploadImages = useMutation<void, Error, FormValue>(
    async (picturesValue) => {
      invariant(
        getAnimal.state === "success",
        "Can upload images only if an animal was found."
      );

      const picturesToUpload = [picturesValue.avatar]
        .concat(picturesValue.pictures)
        .filter(isImageFile);

      if (picturesToUpload.length > 0) {
        await Promise.all(
          picturesToUpload.map((picture) =>
            uploadImageFile(picture, { tags: ["animal"] })
          )
        );
      }

      updateAnimalPictures.mutate({
        id: getAnimal.result.id,
        avatarId: getImageId(picturesValue.avatar),
        picturesId: picturesValue.pictures.map(getImageId),
      });
    }
  );

  const { picturesState, setPicturesState } = useAnimalForm();

  if (getAnimal.state === "error") {
    return <ErrorPage status={getAnimal.status} />;
  }

  let content: React.ReactNode = null;

  if (getAnimal.state === "success") {
    content = (
      <AnimalPicturesForm
        isEdit
        state={picturesState}
        setState={setPicturesState}
        onSubmit={(value) => uploadImages.mutate(value)}
        pending={
          uploadImages.isLoading ||
          updateAnimalPictures.state === "loading" ||
          deleteImages.isLoading
        }
        serverErrors={
          // Don't check `deleteImages.isError` because it's not critical if it
          // fails.
          uploadImages.isError
            ? ["image-upload-error"]
            : updateAnimalPictures.state === "error"
            ? ["server-error"]
            : []
        }
      />
    );
  } else {
    // TODO: Add placeholder
  }

  const name =
    getAnimal.state === "success" ? getAnimal.result.officialName : null;

  return (
    <ApplicationLayout>
      <PageTitle title={name} />

      <Header>
        <HeaderBackLink href="../.." />
        <HeaderTitle>{name ?? <Placeholder $preset="text" />}</HeaderTitle>
      </Header>

      <Main>{content}</Main>
      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

UpdateAnimalPicturesPage.renderLayout = ({ children }) => {
  return <AnimalFormProvider>{children}</AnimalFormProvider>;
};

UpdateAnimalPicturesPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default UpdateAnimalPicturesPage;
