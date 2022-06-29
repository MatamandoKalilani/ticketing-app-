import { OrderCancelledListener } from "../order-cancelled-listener";
import { OrderCancelledEvent, OrderStatus } from "@mata-ticketing/common";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../model/order";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // Create order
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  });

  await order.save();

  // Create the fake data for the event
  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, data, msg };
};

it("Updates the order status to be cancelled", async () => {
  // Get the listener, event data and message from the setup function
  const { listener, order, data, msg } = await setup();

  // Call the onMessage function with the fake message and event data
  await listener.onMessage(data, msg);

  // retrieve the updated order
  const updatedOrder = await Order.findById(order.id);

  // Check if the order status has been changed to cancelled.
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("acknowledges the message", async () => {
  // Get the listener, event data and message from the setup function
  const { listener, data, msg } = await setup();

  // Call the onMessage function with the fake message and event data
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
