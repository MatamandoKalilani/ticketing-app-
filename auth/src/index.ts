import { app } from "./app";
import mongoose from "mongoose";

const port = 3000;

const start = async () => {
  console.log("Starting...");
  if (!process.env.JWT_KEY) {
    throw Error("JWT_KEY not defined");
  }

  if (!process.env.MONGO_URI) {
    throw Error("MONGO_URI Needed!");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.log("Mongo Connection Error");
  }

  app.listen(port, () => {
    console.log("Auth Service Listening at Port : " + port);
  });
};

start();
