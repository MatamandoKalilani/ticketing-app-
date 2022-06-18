import mongoose from "mongoose";

// Properties for when i am creating a ticket
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// Properties to properly define the ticket document mongoose actually creates
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

// Properties to describe a Ticket Model
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

// Overall Schema of a Ticket
const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
    userId: {
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

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

// Build function used to create a ticket (Allows for type checking when creating a ticket).

export { Ticket };
