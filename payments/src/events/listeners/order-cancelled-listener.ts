import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@mata-ticketing/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/order";

import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    // Find the order
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    // in case the order is not found
    if (!order) {
      throw new Error("Order not found");
    }
    // Set the status to cancelled
    order.set({ status: OrderStatus.Cancelled });

    // Save the order
    await order.save();

    // ack the message
    msg.ack();
  }
}
