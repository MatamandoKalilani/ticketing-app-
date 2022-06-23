import { Listener, TicketUpdatedEvent, Subjects } from "@mata-ticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../model/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { id, title, price, version } = data;

    const ticket = await Ticket.findOne({ _id: id, version: version - 1 });

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ title, price });

    await ticket.save();

    msg.ack();
  }
}
