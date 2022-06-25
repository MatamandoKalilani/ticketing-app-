import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
const port = 3000;

const start = async () => {
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
  } catch (err) {
    console.log(err);
  }
};

start();
