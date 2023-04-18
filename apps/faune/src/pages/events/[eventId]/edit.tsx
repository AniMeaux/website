import { OperationParams, UserGroup } from "@animeaux/shared";
import invariant from "invariant";
import { useMutation } from "react-query";
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
import { EventForm, FormValue } from "~/event/form";

const EventEditPage: PageComponent = () => {
  const router = useRouter();

  invariant(
    typeof router.query.eventId === "string",
    `The eventId path should be a string. Got '${typeof router.query.eventId}'`
  );

  const getEvent = useOperationQuery({
    name: "getEvent",
    params: { id: router.query.eventId },
  });

  const deleteEventImage = useMutation<
    void,
    Error,
    OperationParams<"updateEvent">
  >(
    async (params) => {
      invariant(
        getEvent.state === "success",
        "Can delete image only if an event was found."
      );

      if (getEvent.result.image !== params.image) {
        await deleteImage(getEvent.result.image);
      }
    },
    { onSettled: () => router.backIfPossible("..") }
  );

  const updateEvent = useOperationMutation("updateEvent", {
    onSuccess: (response, cache) => {
      deleteEventImage.mutate(response.body.params);

      cache.set(
        { name: "getEvent", params: { id: response.result.id } },
        response.result
      );

      cache.invalidate({ name: "getAllEvents" });
    },
  });

  const uploadEventImage = useMutation<void, Error, FormValue>(
    async (value) => {
      invariant(
        getEvent.state === "success",
        "Can upload image only if an event was found."
      );

      if (isImageFile(value.image)) {
        await uploadImageFile(value.image, { tags: ["event"] });
      }

      updateEvent.mutate({
        ...value,
        id: getEvent.result.id,
        image: getImageId(value.image),
      });
    }
  );

  if (getEvent.state === "error") {
    return <ErrorPage status={getEvent.status} />;
  }

  let content: React.ReactNode = null;

  if (getEvent.state === "success") {
    content = (
      <EventForm
        initialEvent={getEvent.result}
        onSubmit={(value) => uploadEventImage.mutate(value)}
        pending={
          uploadEventImage.isLoading ||
          updateEvent.state === "loading" ||
          deleteEventImage.isLoading
        }
        serverErrors={
          uploadEventImage.isError
            ? ["image-upload-error"]
            : updateEvent.state === "error"
            ? ["server-error"]
            : []
        }
      />
    );
  }

  const name = getEvent.state === "success" ? getEvent.result.title : null;

  return (
    <ApplicationLayout>
      <PageTitle title={name} />

      <Header>
        <HeaderBackLink />
        <HeaderTitle>{name ?? <Placeholder $preset="text" />}</HeaderTitle>
      </Header>

      <Main>{content}</Main>
      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

EventEditPage.authorisedGroups = [UserGroup.ADMIN];

export default EventEditPage;
