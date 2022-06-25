import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Ticket } from "../../model/ticket";

it("fetches the order", async () => {
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

  //Make request to fetch order
  const response = await request(app)
    .get(`/api/orders/${createdOrder.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(response.body.id).toEqual(createdOrder.id);
});

it("A user can only fetch an order they have created", async () => {
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

  //Make request to fetch order
  const response = await request(app)
    .get(`/api/orders/${createdOrder.id}`)
    .set("Cookie", global.signUp())
    .send()
    .expect(401);
});

it("request must only accept a valid order id", async () => {
  //Make request to fetch order with in valid order id
  await request(app)
    .get(`/api/orders/dgfdfgffdgfdgf`)
    .set("Cookie", global.signUp())
    .send()
    .expect(400);
});
