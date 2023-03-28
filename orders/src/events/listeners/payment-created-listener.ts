import {
  Listener,
  PaymentCreatedEvent,
  Topics,
  OrderStatus,
  OnMessageArgs,
} from "@mata-ticketing/common";
import { Order } from "../../model/order";
import { consumerGroupId } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  topic: Topics.PaymentCreated = Topics.PaymentCreated;
  consumerGroupId = consumerGroupId;

  async onMessage({ data, topic }: OnMessageArgs<PaymentCreatedEvent>) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({
      status: OrderStatus.Complete,
    });

    await order.save();
  }
}
