import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

it("404 if id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signUp())
    .send({ title: "test-ticket", price: 20 })
    .expect(404);
});

it("401 if user in not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "test-ticket", price: 20 })
    .expect(401);
});

it("401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signUp())
    .send({ title: "test-ticket", price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signUp())
    .send({ title: "test-update-ticket", price: 5000 })
    .expect(401);
});

it("400 if the user provides and invalid price or title", async () => {
  const cookie = global.signUp();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "test-ticket", price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 5000 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "test-update-ticket", price: -256 })
    .expect(400);
});

it("updates the ticket successfully ", async () => {
  const cookie = global.signUp();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "test-ticket", price: 20 })
    .expect(201);

  const newTitle = "new-ticket--title";
  const newPrice = 2000;

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: newTitle, price: newPrice })
    .expect(200);

  const updatedResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .expect(200);

  expect(updatedResponse.body.title).toEqual(newTitle);
  expect(updatedResponse.body.price).toEqual(newPrice);
});

it("publishes an Event", async () => {
  const cookie = global.signUp();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "test-ticket", price: 20 })
    .expect(201);

  const newTitle = "new-ticket--title";
  const newPrice = 2000;

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: newTitle, price: newPrice })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects an update if the ticket is reserved", async () => {
  const cookie = global.signUp();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "test-ticket", price: 20 })
    .expect(201);

  const ticket = await Ticket.findById(response.body.id);

  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });

  await ticket!.save();

  const newTitle = "new-ticket--title";
  const newPrice = 2000;

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: newTitle, price: newPrice })
    .expect(400);
});
