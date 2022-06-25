import { Listener, OrderCreatedEvent, Subjects } from "@mata-ticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // Reach into Ticket collection and find a ticket that is going to get reserved.
    const ticket = await Ticket.findById(data.ticket.id);

    // if  no ticket exists, throw an error
    if (!ticket) {
      throw new Error("Ticket not Found");
    }

    // Mark the ticket as being reserved by setting the order property to the order id of the incoming order
    ticket.set({ orderId: data.id });

    // Save the ticket
    await ticket.save();

    //Notify users
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
