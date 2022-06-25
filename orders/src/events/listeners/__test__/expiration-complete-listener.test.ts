import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order, OrderStatus } from "../../../model/order";
import { Ticket } from "../../../model/ticket";
import mongoose from "mongoose";
import { ExpirationCompleteEvent } from "@mata-ticketing/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Doctor Strange",
    price: 4000,
  });

  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: "sgfdfgdfg",
    expiresAt: new Date(),
    ticket: ticket,
  });

  await order.save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, msg };
};

it("updates the order status to cancelled", async () => {
  // Get the listener, event data and message from the setup function
  const { listener, order, data, msg } = await setup();

  // Call the onMessage function with the fake message and event data
  await listener.onMessage(data, msg);

  //Assertions
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emit an order cancelled event", async () => {
  // Get the listener, event data and message from the setup function
  const { listener, order, data, msg } = await setup();

  // Call the onMessage function with the fake message and event data
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});

it("ack the message", async () => {
  // Get the listener, event data and message from the setup function
  const { listener, data, msg } = await setup();

  // Call the onMessage function with the fake message and event data
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
