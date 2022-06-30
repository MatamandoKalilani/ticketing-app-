import mongoose from "mongoose";

// Properties for when i am creating a payment
interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

// Properties to properly define the payment document mongoose actually creates
interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

// Properties to describe a payment Model
interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

// Overall Schema of a Payment
const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// Build function used to create a Payment(Allows for type checking when creating an payment).
paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  "Payment",
  paymentSchema
);

export { Payment };
