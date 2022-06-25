import {
  Listener,
  OrderCancelledEvent,
  Subjects,
} from "@mata-ticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    // Find the corresponding ticket
    const ticket = await Ticket.findById(data.ticket.id);

    // if the ticket is not found, throw an error
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Unreserve the ticket
    ticket.set({ orderId: undefined });

    await ticket.save();

    //Publish ticket updated event
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });

    // ack the message
    msg.ack();
  }
}
