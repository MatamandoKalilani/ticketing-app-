import request from "supertest";
import { app } from "../../app";

it("can retrieve a list of tickets", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signUp())
    .send({ title: "test-ticket", price: 20 })
    .expect(201);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signUp())
    .send({ title: "test-ticket-no2", price: 22 })
    .expect(201);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signUp())
    .send({ title: "test-ticket-no3", price: 24 })
    .expect(201);

  const response = await request(app).get("/api/tickets").send({}).expect(200);
  expect(response.body.length).toEqual(3);
});
