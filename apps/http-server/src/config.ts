import { configDotenv } from "dotenv";
configDotenv();

export const apifyKey = process.env.APIFY_KEY
export const apiKey = process.env.API_KEY
export const apiSecret = process.env.API_SECRET
export const accessToken = process.env.ACCESS_TOKEN
export const accessSecret = process.env.ACCESS_SECRET
export const clientId = process.env.CLIENT_ID
export const clientSecret = process.env.CLIENT_SECRET
export const userToken = process.env.BREARER_TOKEN
export const gridlockUserId = process.env.GRIDLOCK_USERID