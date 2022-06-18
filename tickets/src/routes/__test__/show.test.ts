import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("returns a 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("returns the ticket if the ticket exists", async () => {
  const title = "test-ticket";
  const price = 20;

  const createdResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signUp())
    .send({ title, price })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${createdResponse.body.id}`)
    .set("Cookie", global.signUp())
    .send({ title, price })
    .expect(200);

  expect(ticketResponse.body.price).toEqual(price);
  expect(ticketResponse.body.title).toEqual(title);
});
