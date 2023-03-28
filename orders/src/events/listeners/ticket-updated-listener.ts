import {
  Listener,
  OnMessageArgs,
  TicketUpdatedEvent,
  Topics,
} from "@mata-ticketing/common";
import { Ticket } from "../../model/ticket";
import { consumerGroupId } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly topic: Topics.TicketUpdated = Topics.TicketUpdated;
  consumerGroupId = consumerGroupId;

  async onMessage({ data }: OnMessageArgs<TicketUpdatedEvent>) {
    const { title, price } = data;

    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ title, price });

    await ticket.save();
  }
}
