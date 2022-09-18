import { Event, formatDateRange } from "@animeaux/shared";
import styled from "styled-components";
import { Link } from "~/core/link";
import { CloudinaryImage } from "~/dataDisplay/image";

type EventCardLinkProps = {
  event: Event;
};

export function EventCardLink({ event }: EventCardLinkProps) {
  return (
    <EventCard href={event.url}>
      <EventImage imageId={event.image} alt={event.title} />

      <EventInfo>
        <EventTitle>{event.title}</EventTitle>
        <EventLocation>{event.location}</EventLocation>

        <EventDate>
          {formatDateRange(event.startDate, event.endDate, {
            showTime: !event.isFullDay,
          })}
        </EventDate>

        <EventDescription>{event.description}</EventDescription>
      </EventInfo>
    </EventCard>
  );
}

const EventCard = styled(Link)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  @media (hover: hover) {
    &:hover {
      text-decoration: underline;
    }
  }
`;

const EventImage = styled(CloudinaryImage)`
  border-radius: var(--border-radius-m);
  height: 200px;
  width: 100%;
  object-fit: cover;
`;

const EventInfo = styled.div`
  margin-top: var(--spacing-l);
`;

const EventTitle = styled.h2`
  font-size: var(--font-size-l);
  line-height: var(--line-height-l);
  font-weight: var(--font-weight-semibold);
  min-width: 0;
  word-break: break-word;
`;

const EventLocation = styled.p`
  margin-top: var(--spacing-s);
  font-size: var(--font-size-s);
  line-height: var(--line-height-s);
`;

const EventDate = styled.p`
  font-size: var(--font-size-s);
  line-height: var(--line-height-s);
`;

const EventDescription = styled.p`
  margin-top: var(--spacing-s);
`;
