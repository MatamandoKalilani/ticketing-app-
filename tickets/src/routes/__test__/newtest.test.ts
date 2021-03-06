import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("it has a route handler listening to /api/tickets for post requests ", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("Route wont work when a user is not signed in ", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("Route will work when a user is signed in ", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signUp())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signUp())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signUp())
    .send({
      price: 10,
    })
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signUp())
    .send({
      title: "NBA Finals",
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signUp())
    .send({
      title: "NBA Finals",
    })
    .expect(400);
});

it("creates a ticket with valid parameters ", async () => {
  let tickets = await Ticket.find({});

  expect(tickets.length).toEqual(0);

  const title = "test-ticket";
  const price = 20;

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signUp())
    .send({ title, price })
    .expect(201);

  tickets = await Ticket.find({});

  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(price);
  expect(tickets[0].title).toEqual(title);
});

it("publishes an Event", async () => {
  const title = "test-ticket";
  const price = 20;

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signUp())
    .send({ title, price })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
