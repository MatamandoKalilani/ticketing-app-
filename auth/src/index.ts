import express from "express";
import "express-async-errors";
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/sign-in";
import { signOutRouter } from "./routes/sign-out";
import { signUpRouter } from "./routes/sign-up";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
const port = 3000;
app.use(express.json());

app.use(signUpRouter);
app.use(signInRouter);
app.use(currentUserRouter);
app.use(signOutRouter);

app.all("*", async () => {
  console.log("Not Found");
  throw new NotFoundError();
});

app.use(errorHandler);

app.listen(port, () => {
  console.log("Auth Service Listening at Port: " + port);
});
