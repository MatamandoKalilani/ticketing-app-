import { app } from "./app";
import mongoose from "mongoose";

const port = 3000;

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw Error("JWT_KEY not defined");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
  } catch (err) {
    console.log("Mongo Connection Error");
  }
  
  app.listen(port, () => {
    console.log("Auth Service Listening at Port : " + port);
  });
};

start();
