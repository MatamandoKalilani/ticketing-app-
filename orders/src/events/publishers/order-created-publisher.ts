import { Publisher, OrderCreatedEvent, Topics } from "@mata-ticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  topic: Topics.OrderCreated = Topics.OrderCreated;
}
