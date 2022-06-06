import {
  Event,
  EVENT_CATEGORY_LABELS,
  formatDateRange,
  UserGroup,
} from "@animeaux/shared";
import invariant from "invariant";
import {
  FaAngleRight,
  FaCalendarDay,
  FaCertificate,
  FaEye,
  FaEyeSlash,
  FaMapMarkerAlt,
  FaPen,
  FaTimesCircle,
  FaTrash,
} from "react-icons/fa";
import { useMutation, UseMutationResult } from "react-query";
import styled from "styled-components";
import { QuickActions } from "~/core/actions/quickAction";
import { deleteImage } from "~/core/cloudinary";
import { ImageSlideshow } from "~/core/dataDisplay/imageSlideshow";
import { Info } from "~/core/dataDisplay/info";
import {
  ButtonItem,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
} from "~/core/dataDisplay/item";
import { Markdown } from "~/core/dataDisplay/markdown";
import { ApplicationLayout } from "~/core/layouts/applicationLayout";
import { ErrorPage } from "~/core/layouts/errorPage";
import { Header, HeaderBackLink, HeaderTitle } from "~/core/layouts/header";
import { Main } from "~/core/layouts/main";
import { Navigation } from "~/core/layouts/navigation";
import { Section, SectionTitle } from "~/core/layouts/section";
import { Separator } from "~/core/layouts/separator";
import { Placeholder } from "~/core/loaders/placeholder";
import { useOperationMutation, useOperationQuery } from "~/core/operations";
import { PageTitle } from "~/core/pageTitle";
import { useModal } from "~/core/popovers/modal";
import { useRouter } from "~/core/router";
import { PageComponent } from "~/core/types";
import { theme } from "~/styles/theme";

const EventPage: PageComponent = () => {
  const router = useRouter();

  invariant(
    typeof router.query.eventId === "string",
    `The eventId path should be a string. Got '${typeof router.query.eventId}'`
  );

  const getEvent = useOperationQuery({
    name: "getEvent",
    params: { id: router.query.eventId },
  });

  const deleteEvent = useOperationMutation("deleteEvent", {
    onSuccess: (response, cache) => {
      cache.remove({
        name: "getEvent",
        params: { id: response.body.params.id },
      });

      cache.invalidate({ name: "getAllEvents" });
      router.backIfPossible("..");
    },
  });

  const deleteEventImage = useMutation<void, Error, Event>(async (event) => {
    if (event.image != null) {
      await deleteImage(event.image);
    }

    deleteEvent.mutate({ id: event.id });
  });

  if (getEvent.state === "error") {
    return <ErrorPage status={getEvent.status} />;
  }

  let content: React.ReactNode = null;

  if (getEvent.state === "success") {
    content = (
      <>
        {(deleteEvent.state === "error" || deleteEventImage.isError) && (
          <Section>
            <Info variant="error" icon={<FaTimesCircle />}>
              {getEvent.result.title} n'a pas pu être supprimé.
            </Info>
          </Section>
        )}

        <PicturesSection event={getEvent.result} />
        <MetaSection event={getEvent.result} />

        <Section>
          <SectionTitle>Courte description</SectionTitle>

          <DescriptionText preset="paragraph">
            {getEvent.result.shortDescription}
          </DescriptionText>
        </Section>

        <Section>
          <SectionTitle>Description</SectionTitle>

          <DescriptionText preset="paragraph">
            {getEvent.result.description}
          </DescriptionText>
        </Section>

        <QuickActions icon={<FaPen />}>
          <ActionsSection
            event={getEvent.result}
            deleteEvent={deleteEventImage}
          />
        </QuickActions>
      </>
    );
  }

  const displayName =
    getEvent.state === "success" ? getEvent.result.title : null;

  return (
    <ApplicationLayout>
      <PageTitle title={displayName} />

      <Header>
        <HeaderBackLink />
        <HeaderTitle>
          {displayName ?? <Placeholder $preset="text" />}
        </HeaderTitle>
      </Header>

      <Main>{content}</Main>
      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

EventPage.authorisedGroups = [UserGroup.ADMIN];

export default EventPage;

const DescriptionText = styled(Markdown)`
  padding: 0 ${theme.spacing.x2};
`;

type EventProp = { event: Event };

function PicturesSection({ event }: EventProp) {
  const picturesId = event.image == null ? [] : [event.image];
  return <ImageSlideshow images={picturesId} alt={event.title} />;
}

function MetaSection({ event }: EventProp) {
  return (
    <Section>
      <ul>
        <li>
          <Item>
            <ItemIcon>{event.isVisible ? <FaEye /> : <FaEyeSlash />}</ItemIcon>

            <ItemContent>
              <ItemMainText>
                {event.isVisible ? "Publié sur le site internet" : "Invisible"}
              </ItemMainText>
            </ItemContent>
          </Item>
        </li>

        <li>
          <LinkItem
            shouldOpenInNewTarget
            href={`http://maps.google.com/?q=${encodeURIComponent(
              event.location
            )}`}
          >
            <ItemIcon>
              <FaMapMarkerAlt />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>{event.location}</ItemMainText>
            </ItemContent>
          </LinkItem>
        </li>

        <li>
          <Item>
            <ItemIcon>
              <FaCalendarDay />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>
                {formatDateRange(event.startDate, event.endDate, {
                  showTime: !event.isFullDay,
                })}
              </ItemMainText>
            </ItemContent>
          </Item>
        </li>

        <li>
          <Item>
            <ItemIcon>
              <FaCertificate />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>
                {EVENT_CATEGORY_LABELS[event.category]}
              </ItemMainText>
            </ItemContent>
          </Item>
        </li>
      </ul>
    </Section>
  );
}

function ActionsSection({
  event,
  deleteEvent,
}: EventProp & {
  deleteEvent: UseMutationResult<void, Error, Event, unknown>;
}) {
  const { onDismiss } = useModal();

  return (
    <>
      <Section>
        <LinkItem href="./edit" onClick={onDismiss}>
          <ItemIcon>
            <FaPen />
          </ItemIcon>

          <ItemContent>
            <ItemMainText>Modifier</ItemMainText>
          </ItemContent>

          <ItemIcon>
            <FaAngleRight />
          </ItemIcon>
        </LinkItem>
      </Section>

      <Separator />

      <Section>
        <DeleteEventButton event={event} deleteEvent={deleteEvent} />
      </Section>
    </>
  );
}

function DeleteEventButton({
  event,
  deleteEvent,
}: EventProp & {
  deleteEvent: UseMutationResult<void, Error, Event, unknown>;
}) {
  const { onDismiss } = useModal();

  return (
    <ButtonItem
      onClick={() => {
        if (!deleteEvent.isLoading) {
          const confirmationMessage = [
            `Êtes-vous sûr de vouloir supprimer ${event.title} ?`,
            "L'action est irréversible.",
          ].join("\n");

          if (window.confirm(confirmationMessage)) {
            onDismiss();
            deleteEvent.mutate(event);
          }
        }
      }}
      color="red"
    >
      <ItemIcon>
        <FaTrash />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>Supprimer</ItemMainText>
      </ItemContent>
    </ButtonItem>
  );
}
