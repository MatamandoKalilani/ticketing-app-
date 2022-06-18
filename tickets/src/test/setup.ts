import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";
import jwt from "jsonwebtoken";

declare global {
  var signUp: () => string[];
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "sdgdfgdfg";
  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signUp = () => {
  // build the JWT Payload

  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  // Create JWT Token
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //Create Session Object
  const session = { jwt: token };

  //Turn that session object into JSON
  const sessionJSON = JSON.stringify(session);

  //Turn it into Base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return string
  return [`session=${base64}`];
};
