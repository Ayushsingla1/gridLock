import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import mainRouter from "./controllers/mainRouter";

configDotenv();
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONT_END,
  }),
);
// app.use(middleware);

app.use("/api/v1", mainRouter);

const PORT = 3001;

app.listen(PORT, () => {
  console.log("hi there");
});
