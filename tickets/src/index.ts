import { app } from "./app";
import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

const port = 3000;

const start = async () => {
  console.log("Starting...1.2.3");
  if (!process.env.JWT_KEY) {
    throw Error("JWT_KEY not defined");
  }

  if (!process.env.MONGO_URI) {
    throw Error("Mongo URI Needed!");
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw Error("NATS_CLIENT_ID Needed!");
  }

  if (!process.env.NATS_URL) {
    throw Error("NATS_URL Needed!");
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw Error("NATS_CLUSTER_ID Needed!");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("Nats connection closed");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.log("Mongo Connection Error");
  }

  app.listen(port, () => {
    console.log("Tickets Service Listening at Port : " + port);
  });
};

start();
