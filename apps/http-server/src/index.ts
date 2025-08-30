import express from "express";
import { configDotenv } from "dotenv";

import cors from 'cors'
import XRouter from './controllers/twitterRouters' 
configDotenv();

const app = express();
app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000"
}))
app.use('/api/v1', XRouter);

// env

const PORT = 3001;

app.listen(PORT,() => {
    console.log("hi there");
})