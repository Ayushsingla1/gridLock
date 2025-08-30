import express from "express";
import { configDotenv } from "dotenv";

import XRouter from './controllers/twitterRouters' 
configDotenv();

const app = express();
app.use(express.json())
app.use('/api/v1', XRouter);

// env

const PORT = 3001;

app.listen(PORT,() => {
    console.log("hi there");
})