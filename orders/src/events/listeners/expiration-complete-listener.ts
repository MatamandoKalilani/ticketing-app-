import {
  Listener,
  ExpirationCompleteEvent,
  Topics,
  OrderStatus,
  OnMessageArgs,
} from "@mata-ticketing/common";
import { consumerGroupId } from "./queue-group-name";
import { Order } from "../../model/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import KafkaWrapper from "@mata-ticketing/common/build/events/kafka-wrapper";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  topic: Topics.ExpirationComplete = Topics.ExpirationComplete;
  consumerGroupId = consumerGroupId;

  async onMessage({ data }: OnMessageArgs<ExpirationCompleteEvent>) {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) {
      throw new Error("Order not Found");
    }

    if (order.status === OrderStatus.Complete) {
      return;
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    new OrderCancelledPublisher({
      kafkaWrapper: KafkaWrapper.getInstance(),
    }).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
  }
}
