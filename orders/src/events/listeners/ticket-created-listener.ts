import { Listener, TicketCreatedEvent, Subjects } from "@mata-ticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../model/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;

    const ticket = Ticket.build({ id, title, price });

    await ticket.save();

    msg.ack();
  }
}
