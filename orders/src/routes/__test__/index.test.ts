import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../model/order";
import { Ticket } from "../../model/ticket";

const createTicket = async () => {
  const ticket = Ticket.build({
    title: "Success Tree",
    price: 2200,
  });

  await ticket.save();
  return ticket;
};
it("can retrieve orders for a specific user", async () => {
  const ticket1 = await createTicket();
  const ticket2 = await createTicket();
  const ticket3 = await createTicket();

  const userOne = global.signUp();
  const userTwo = global.signUp();

  // User one makes an Order
  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticket1.id })
    .expect(201);

  // User two makes two orders
  const { body: order1 } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticket2.id })
    .expect(201);

  const { body: order2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticket3.id })
    .expect(201);

  // User Two queries for his orders.
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(order1.id);
  expect(response.body[1].id).toEqual(order2.id);
});
