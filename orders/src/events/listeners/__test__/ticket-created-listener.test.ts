import mongoose from "mongoose";
import { TicketCreatedEvent } from "@mata-ticketing/common";
import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../model/ticket";

const setup = async () => {
  // Create a listener with a fake nats client
  const listener = new TicketCreatedListener(natsWrapper.client);

  // Create the fake data for the event
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Doctor Strange 3",
    price: 49,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };

  // Make a fake implementation of a message object received from node-nats-streaming
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // Return the listener, the event data and the message
  return { listener, data, msg };
};

it("It creates and saves a ticket", async () => {
  // Get the listener, event data and message from the setup function
  const { listener, data, msg } = await setup();

  // Call the onMessage function with the fake message and event data
  await listener.onMessage(data, msg);

  // Make an assertion on the data within the ticket collection
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("ack the message for the event", async () => {
  // Get the listener, event data and message from the setup function
  const { listener, data, msg } = await setup();

  // Call the onMessage function with the fake message and event data
  await listener.onMessage(data, msg);

  // Make an assertion on the ack function of the message object, to ensure it was called
  expect(msg.ack).toHaveBeenCalled();
});
