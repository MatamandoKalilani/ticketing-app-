import { Publisher, OrderCancelledEvent, Topics } from "@mata-ticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  topic: Topics.OrderCancelled = Topics.OrderCancelled;
}
