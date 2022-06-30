import {
  Publisher,
  Subjects,
  PaymentCreatedEvent,
} from "@mata-ticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
