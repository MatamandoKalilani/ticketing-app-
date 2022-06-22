import { app } from "./app";
import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";

const port = 3000;

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw Error("JWT_KEY not defined");
  }

  if (!process.env.MONGO_URI) {
    throw Error("Mongo URI Needed!");
  }

  try {
    await natsWrapper.connect("ticketing", "gdfgfdgfd", "http:nats-srv:4222");

    natsWrapper.client.on("close", () => {
      console.log("Nats connection closed");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.log("Mongo Connection Error");
  }

  app.listen(port, () => {
    console.log("Tickets Service Listening at Port : " + port);
  });
};

start();
