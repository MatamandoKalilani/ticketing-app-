import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../model/order";
import { Ticket } from "../../model/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signUp())
    .send({ ticketId })
    .expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Trees",
    price: 7000,
  });

  await ticket.save();

  const order = Order.build({
    ticket,
    userId: "matamando kalilani",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signUp())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("successfully reserves a ticket", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Success Tree",
    price: 2200,
  });

  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signUp())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("Emits an Order Created Event", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Success Tree",
    price: 2200,
  });

  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signUp())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
