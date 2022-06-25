import { TicketUpdatedListener } from "../ticket-updated-listener";
import { TicketUpdatedEvent } from "@mata-ticketing/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../model/ticket";
import mongoose from "mongoose";

const setup = async () => {
  // Create and save a new ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Doctor Strange 2",
    price: 49,
  });

  await ticket.save();

  // Create a listener with a fake nats client
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create the fake data for the event
  const updatedPrice = 50;
  const updatedTitle = "SpiderMan 3";

  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    title: updatedTitle,
    price: updatedPrice,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: ticket.version + 1,
  };

  // Make a fake implementation of a message object received from node-nats-streaming
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // Return the listener, the event data and the message
  return { listener, ticket, data, msg };
};

it("finds, updates and save the changes to a ticket", async () => {
  // Get the listener, event data and message from the setup function
  const { listener, ticket, data, msg } = await setup();

  // Call the onMessage function with the fake message and event data
  await listener.onMessage(data, msg);

  // Make an assertion on the data within the ticket collection
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acknowledges a message", async () => {
  // Get the listener, event data and message from the setup function
  const { listener, data, msg } = await setup();

  // Call the onMessage function with the fake message and event data
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the version number is out of sync", async () => {
  // Get the listener, event data and message from the setup function
  const { listener, data, msg } = await setup();

  data.version = 10;

  // Call the onMessage function with the fake message and event data
  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
