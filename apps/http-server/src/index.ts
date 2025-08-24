import express from "express";
import { configDotenv } from "dotenv";
import axios from "axios";
import XRouter from './controllers/twitterRouters' 
configDotenv();

const app = express();
app.use(express.json())
app.use('/api/v1', XRouter);

// env

const PORT = 3000;

app.listen(PORT,() => {
    console.log("hi there");
})