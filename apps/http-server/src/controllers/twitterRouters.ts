import { Router } from "express";
import { getFollowers } from "./twitterControllers/followers.controllers";
import { postTweet } from "./twitterControllers/post.controllers";

const XRouter: Router = Router();


XRouter.get('/getFollowers', getFollowers);
XRouter.post('/tweet', postTweet);

export default XRouter
