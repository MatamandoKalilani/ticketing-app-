import {
  Listener,
  OnMessageArgs,
  TicketCreatedEvent,
  Topics,
} from "@mata-ticketing/common";
import { Ticket } from "../../model/ticket";
import { consumerGroupId } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly topic: Topics.TicketCreated = Topics.TicketCreated;
  consumerGroupId = consumerGroupId;

  async onMessage({ data }: OnMessageArgs<TicketCreatedEvent>) {
    const { id, title, price } = data;

    const ticket = Ticket.build({ id, title, price });

    await ticket.save();
  }
}
