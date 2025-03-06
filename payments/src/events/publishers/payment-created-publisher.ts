import { Subjects
    , Publisher
    , PaymentCreatedEvent
 } from "@hnticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}