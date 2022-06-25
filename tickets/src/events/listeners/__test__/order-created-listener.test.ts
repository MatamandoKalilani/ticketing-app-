import { OrderCreatedListener } from "../order-created-listener";
import { OrderCreatedEvent, OrderStatus } from "@mata-ticketing/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  //create and save a ticket
  const ticket = Ticket.build({
    title: "I am Groot",
    price: 400,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  // Create the fake data for the event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("Sets the orderId for the ticket", async () => {
  // Get the listener, event data and message from the setup function
  const { listener, ticket, data, msg } = await setup();

  // Call the onMessage function with the fake message and event data
  await listener.onMessage(data, msg);

  // Pull the updated copy of the ticket
  const updatedTicket = await Ticket.findById(ticket.id);

  // Check if the orderId property has been set.
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acknowledges the message", async () => {
  // Get the listener, event data and message from the setup function
  const { listener, data, msg } = await setup();

  // Call the onMessage function with the fake message and event data
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("it publishes a ticket updated event", async () => {
  // Get the listener, event data and message from the setup function
  const { listener, ticket, data, msg } = await setup();

  // Call the onMessage function with the fake message and event data
  await listener.onMessage(data, msg);

  //Was the publish method called?
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
