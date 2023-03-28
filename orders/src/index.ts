import { app } from "./app";
import mongoose from "mongoose";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";
import { PaymentCreatedListener } from "./events/listeners/payment-created-listener";
import KafkaWrapper from "@mata-ticketing/common/build/events/kafka-wrapper";

const port = 3000;

const start = async () => {
  console.log("Starting...1.2.3");
  if (!process.env.JWT_KEY) {
    throw Error("JWT_KEY not defined");
  }

  if (!process.env.MONGO_URI) {
    throw Error("Mongo URI Needed!");
  }

  if (!process.env.KAFKA_CLIENT_ID) {
    throw Error("KAFKA_CLIENT_ID Needed!");
  }

  if (!process.env.KAFKA_BROKERS_SERVER) {
    throw Error("KAFKA_BROKERS_SERVER Needed!");
  }

  if (!process.env.KAFKA_SASL_USERNAME) {
    throw Error("KAFKA_SASL_USERNAME Needed!");
  }

  if (!process.env.KAFKA_SASL_PASSWORD) {
    throw Error("KAFKA_SASL_USERNAME Needed!");
  }

  try {
    const kafkaWrapper = KafkaWrapper.getInstance();

    await kafkaWrapper.connect({
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: [process.env.KAFKA_BROKERS_SERVER],
      sasl: {
        username: process.env.KAFKA_SASL_USERNAME,
        password: process.env.KAFKA_SASL_PASSWORD,
        mechanism: "plain",
      },
      ssl: true,
    });

    //Listeners
    new TicketCreatedListener({ kafkaWrapper }).listen();
    new TicketUpdatedListener({ kafkaWrapper }).listen();
    new ExpirationCompleteListener({ kafkaWrapper }).listen();
    new PaymentCreatedListener({ kafkaWrapper }).listen();

    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.log("Mongo Connection Error");
  }

  app.listen(port, () => {
    console.log("Orders Service Listening at Port : " + port);
  });
};

start();
