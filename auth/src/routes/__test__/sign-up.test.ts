import request from "supertest";
import { app } from "../../app";

it("Returns a 201 on successful sign up", async () => {
  return request(app)
    .post("/api/users/sign-up")
    .send({ email: "test@test.com", password: "Qwerty@1" })
    .expect(201);
});

it("it returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/sign-up")
    .send({ email: "tessdgdfcom", password: "Qwerty@1" })
    .expect(400);
});

it("it returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/sign-up")
    .send({ email: "tessdgdfcom", password: "3" })
    .expect(400);
});

it("it returns a 400 if password or email missing", async () => {
  await request(app)
    .post("/api/users/sign-up")
    .send({ password: "Qwerty@1Qwerty@1" })
    .expect(400);

  return request(app)
    .post("/api/users/sign-up")
    .send({ email: "test@cheese.com" })
    .expect(400);
});

it("disallows using duplicate emails", async () => {
  await request(app)
    .post("/api/users/sign-up")
    .send({ email: "mata@mata.com", password: "Qwertyuiop" })
    .expect(201);

  return request(app)
    .post("/api/users/sign-up")
    .send({ email: "mata@mata.com", password: "Qwerty1Qwerty1" })
    .expect(400);
});

it("Sets a cookie after successful sign up", async () => {
  const response = await request(app)
    .post("/api/users/sign-up")
    .send({ email: "mata@mata.com", password: "Qwertyuiop" })
    .expect(201);

  return expect(response.get("Set-Cookie")).toBeDefined();
});
