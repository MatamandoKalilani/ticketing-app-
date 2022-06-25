import { OrderStatus } from "@mata-ticketing/common";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../model/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("an order can be cancelled", async () => {
  // Build Ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Success Tree",
    price: 2200,
  });

  await ticket.save();

  const user = global.signUp();

  // User makes an Order
  const { body: createdOrder } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make sure order is not cancelled after creation
  expect(createdOrder.status).not.toEqual(OrderStatus.Cancelled);

  // Make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${createdOrder.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  //Make request to fetch order
  const response = await request(app)
    .get(`/api/orders/${createdOrder.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  // Check that Order is cancelled
  expect(response.body.status).toEqual(OrderStatus.Cancelled);
});

it("request must only accept a valid order id", async () => {
  //Make request to fetch order with in valid order id
  await request(app)
    .delete(`/api/orders/dgfdfgffdgfdgf`)
    .set("Cookie", global.signUp())
    .send()
    .expect(400);
});

it("Emits an order cancelled event", async () => {
  // Make a Ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Success Tree",
    price: 2200,
  });

  await ticket.save();

  const user = global.signUp();

  // User makes an Order
  const { body: createdOrder } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Cancel Order
  await request(app)
    .delete(`/api/orders/${createdOrder.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
