import { UserGroup } from "@animeaux/shared";
import { useMutation } from "react-query";
import { uploadImageFile } from "~/core/cloudinary";
import { getImageId, isImageFile } from "~/core/dataDisplay/image";
import { ApplicationLayout } from "~/core/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "~/core/layouts/header";
import { Main } from "~/core/layouts/main";
import { Navigation } from "~/core/layouts/navigation";
import { useOperationMutation } from "~/core/operations";
import { PageTitle } from "~/core/pageTitle";
import { useRouter } from "~/core/router";
import { PageComponent } from "~/core/types";
import { EventForm, FormValue } from "~/event/form";

const CreateEventPage: PageComponent = () => {
  const router = useRouter();

  const createEvent = useOperationMutation("createEvent", {
    onSuccess: (response, cache) => {
      cache.set(
        { name: "getEvent", params: { id: response.result.id } },
        response.result
      );

      cache.invalidate({ name: "getAllEvents" });
      router.backIfPossible("..");
    },
  });

  const uploadEventImage = useMutation<void, Error, FormValue>(
    async (value) => {
      if (
        value.image != null &&
        // It can only be an `ImageFile` when creating a new event but we do it
        // for type checking (cast).
        isImageFile(value.image)
      ) {
        await uploadImageFile(value.image, { tags: ["event"] });
      }

      createEvent.mutate({
        ...value,
        image: value.image == null ? null : getImageId(value.image),
      });
    }
  );

  return (
    <ApplicationLayout>
      <PageTitle title="Nouvel Événement" />

      <Header>
        <HeaderBackLink />
        <HeaderTitle>Nouvel Événement</HeaderTitle>
      </Header>

      <Main>
        <EventForm
          onSubmit={(value) => uploadEventImage.mutate(value)}
          pending={
            uploadEventImage.isLoading || createEvent.state === "loading"
          }
          serverErrors={
            uploadEventImage.isError
              ? ["image-upload-error"]
              : createEvent.state === "error"
              ? ["server-error"]
              : []
          }
        />
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

CreateEventPage.authorisedGroups = [UserGroup.ADMIN];

export default CreateEventPage;
