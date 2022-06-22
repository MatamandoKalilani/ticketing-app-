import {
    Publisher,
    Subjects,
    TicketUpdatedEvent,
  } from "@mata-ticketing/common";
  
  export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  }
  