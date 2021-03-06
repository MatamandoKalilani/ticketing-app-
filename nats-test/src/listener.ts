import nats from "node-nats-streaming";
import { TicketCreatedListener } from "./events/ticket-created-listener";
import { randomBytes } from "crypto";

console.clear();

const stan = nats.connect(
  "ticketing",
  `listener_${randomBytes(4).toString("hex")}`,
  {
    url: "http://localhost:4222",
  }
);

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  new TicketCreatedListener(stan).listen();
  
  stan.on("close", () => {
    console.log("Nats connection closed");
    process.exit();
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());

// --------------------
