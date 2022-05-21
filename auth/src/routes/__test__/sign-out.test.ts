import request from "supertest";
import { app } from "../../app";

it("Clears cookie after sign out", async () => {
  await request(app)
    .post("/api/users/sign-up")
    .send({ email: "test@test.com", password: "Qwerty@1" })
    .expect(201);

  const response = await request(app)
    .post("/api/users/sign-out")
    .send({})
    .expect(200);
  return expect(response.get("Set-Cookie")).toBeDefined();
});
