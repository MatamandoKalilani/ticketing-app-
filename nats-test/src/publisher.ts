import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect(
  "ticketing",
  `publisher_${randomBytes(4).toString("hex")}`,
  {
    url: "http://localhost:4222",
  }
);

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const publisher = new TicketCreatedPublisher(stan);

  try {
    await publisher.publish({ id: "23432", title: "concert", price: 20 });
  } catch (err) {
    console.error(err);
  }

  stan.on("close", () => {
    console.log("Nats connection closed");
    process.exit();
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());

// --------------
