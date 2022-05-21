import request from "supertest";
import { app } from "../../app";

it("fails when a email that does not not exist is supplied", async () => {
  await request(app)
    .post("/api/users/sign-up")
    .send({ email: "test@test.com", password: "Qwerty@1" })
    .expect(201);

  return request(app)
    .post("/api/users/sign-in")
    .send({ email: "test@test.com", password: "Qwe" })
    .expect(400);
});

it("Set Cookie after Sign up", async () => {
  await request(app)
    .post("/api/users/sign-up")
    .send({ email: "test@test.com", password: "Qwerty@1" })
    .expect(201);

  const response = await request(app)
    .post("/api/users/sign-in")
    .send({ email: "test@test.com", password: "Qwerty@1" })
    .expect(200);

  return expect(response.get("Set-Cookie")).toBeDefined();
});
