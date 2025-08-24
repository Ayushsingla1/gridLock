import { Router } from "express";
import { getFollowers } from "./twitterControllers/followers.controllers";

const XRouter: Router = Router();


XRouter.get('/getFollowers', getFollowers);

export default XRouter
