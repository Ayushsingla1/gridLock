import express from "express";
import { configDotenv } from "dotenv";

import cors from 'cors'
import XRouter from './controllers/twitterRouters' 
import roomsRouter from "./controllers/roomRouters";
import userRouter from "./controllers/userRouters";
configDotenv();

const app = express();
app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000"
}))
app.use('/api/v1', XRouter);
app.use('/api/v1', roomsRouter);
app.use('/api/v1', userRouter);

// env

const PORT = 3001;

app.listen(PORT,() => {
    console.log("hi there");
})