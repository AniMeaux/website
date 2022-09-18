import {
  Event,
  EVENT_CATEGORY_LABELS,
  formatDateRange,
  UserGroup,
} from "@animeaux/shared";
import { DateTime } from "luxon";
import { FaPlus } from "react-icons/fa";
import styled from "styled-components";
import { QuickLinkAction } from "~/core/actions/quickAction";
import { Avatar, AvatarPlaceholder } from "~/core/dataDisplay/avatar";
import { EmptyMessage } from "~/core/dataDisplay/emptyMessage";
import { AvatarImage } from "~/core/dataDisplay/image";
import {
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemSecondaryText,
  LinkItem,
} from "~/core/dataDisplay/item";
import { isDefined } from "~/core/isDefined";
import { joinReactNodes } from "~/core/joinReactNodes";
import { ApplicationLayout } from "~/core/layouts/applicationLayout";
import { ErrorPage } from "~/core/layouts/errorPage";
import { Header, HeaderTitle, HeaderUserAvatar } from "~/core/layouts/header";
import { Main } from "~/core/layouts/main";
import { Navigation } from "~/core/layouts/navigation";
import { Section } from "~/core/layouts/section";
import { usePageScrollRestoration } from "~/core/layouts/usePageScroll";
import { Placeholder, Placeholders } from "~/core/loaders/placeholder";
import { usePaginatedOperationQuery } from "~/core/operations";
import { PageTitle } from "~/core/pageTitle";
import { PageComponent } from "~/core/types";
import { theme } from "~/styles/theme";

const TITLE = "Événements";

const EventListPage: PageComponent = () => {
  usePageScrollRestoration();

  const getAllEvents = usePaginatedOperationQuery({
    name: "getAllEvents",
    params: {},
  });

  if (getAllEvents.state === "error") {
    return <ErrorPage status={getAllEvents.status} />;
  }

  let content: React.ReactNode = null;

  if (getAllEvents.state === "success") {
    // There is allways at least one page.
    if (getAllEvents.results[0].hitsTotalCount === 0) {
      content = <EmptyMessage>Il n'y a pas encore d'événement</EmptyMessage>;
    } else {
      const itemsNode: React.ReactNode[] = [];

      getAllEvents.results.forEach((result) => {
        result.hits.forEach((event) => {
          itemsNode.push(
            <li key={event.id}>
              <EventItem event={event} />
            </li>
          );
        });
      });

      content = (
        <ul>
          {itemsNode}
          {getAllEvents.isFetchingNextPage && (
            <li>
              <EventItemPlaceholder />
            </li>
          )}
        </ul>
      );
    }
  } else {
    content = (
      <ul>
        <Placeholders count={5}>
          <li>
            <EventItemPlaceholder />
          </li>
        </Placeholders>
      </ul>
    );
  }

  return (
    <ApplicationLayout>
      <PageTitle title={TITLE} />

      <Header>
        <HeaderUserAvatar />

        <HeaderTitle>
          {TITLE}{" "}
          {getAllEvents.state === "success" &&
            `(${getAllEvents.results[0].hitsTotalCount})`}
        </HeaderTitle>
      </Header>

      <Main>
        <Section>{content}</Section>

        <QuickLinkAction href="./new">
          <FaPlus />
        </QuickLinkAction>
      </Main>

      <Navigation />
    </ApplicationLayout>
  );
};

EventListPage.authorisedGroups = [UserGroup.ADMIN];

export default EventListPage;

function EventItem({ event }: { event: Event }) {
  return (
    <EventLinkItem
      href={event.id}
      $isPassed={DateTime.fromISO(event.endDate) < DateTime.now()}
    >
      <ItemIcon>
        <Avatar>
          <AvatarImage image={event.image} alt={event.title} />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{event.title}</ItemMainText>
        <ItemSecondaryText>
          {joinReactNodes(
            [
              event.location,
              formatDateRange(event.startDate, event.endDate, {
                showTime: !event.isFullDay,
              }),
              EVENT_CATEGORY_LABELS[event.category],
              event.isVisible ? null : <strong key="isDraft">Brouillon</strong>,
            ].filter(isDefined),
            " • "
          )}
        </ItemSecondaryText>
      </ItemContent>
    </EventLinkItem>
  );
}

const EventLinkItem = styled(LinkItem)<{ $isPassed: boolean }>`
  opacity: ${(props) => (props.$isPassed ? theme.opacity.disabled : 1)};
`;

function EventItemPlaceholder() {
  return (
    <Item>
      <ItemIcon>
        <AvatarPlaceholder />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Placeholder $preset="label" />
        </ItemMainText>
        <ItemSecondaryText>
          <Placeholder $preset="text" />
        </ItemSecondaryText>
      </ItemContent>
    </Item>
  );
}
