import express, { NextFunction, Request, Response } from "express";
import { configDotenv } from "dotenv";
import cors from 'cors'
import XRouter from './controllers/twitterRouters' 
import roomsRouter from "./controllers/roomRouters";
import userRouter from "./controllers/userRouters";
import { middleware } from "./middleware";
import { createGame } from "./controllers/resultAnnounce.ts";
import { announceResult } from "./controllers/resultAnnounce.ts";
import da from "zod/v4/locales/da.js";

configDotenv();
const app = express();
app.use(express.json())
app.use(cors({
    origin: process.env.FRONT_END 
}))

const date = new Date();
console.log(date.toISOString());

createGame("cdhjvhj",date,"ayushsingla32","devAgr");

// console.log(Date.now().toLocaleString())
// app.use(middleware);

app.use('/api/v1',XRouter);
app.use('/api/v1',roomsRouter);
app.use('/api/v1', userRouter);

const PORT = 3001;

app.listen(PORT,() => {
    console.log("hi there");
})