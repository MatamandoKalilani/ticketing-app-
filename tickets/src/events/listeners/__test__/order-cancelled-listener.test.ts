import { OrderCancelledListener } from "../order-cancelled-listener";
import { OrderCancelledEvent } from "@mata-ticketing/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // Create orderId
  const orderId = new mongoose.Types.ObjectId().toHexString();

  // Create and save a ticket
  const ticket = Ticket.build({
    title: "I am Groot",
    price: 400,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  ticket.set({ orderId });

  await ticket.save();

  // Create the fake data for the event
  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, orderId, data, msg };
};

it("Updates the ticket, publishes an event, and acknowledges the message", async () => {
  // Get the listener, event data and message from the setup function
  const { listener, ticket, data, msg } = await setup();

  // Call the onMessage function with the fake message and event data
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  // Check if the orderId property has been set.
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
