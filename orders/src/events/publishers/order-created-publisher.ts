import { Publisher, OrderCreatedEvent, Subjects } from "@mata-ticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
