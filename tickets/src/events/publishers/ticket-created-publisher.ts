import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@mata-ticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
