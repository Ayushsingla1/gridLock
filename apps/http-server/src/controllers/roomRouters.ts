import e, { Router } from "express";
import { createMatch } from "./gameControllers/roomCreation";
import { fetchMatchInfo } from "./gameControllers/matchInfor";
import { middleware } from "../middleware";

const roomsRouter: Router = Router();

roomsRouter.post('/createMatch', middleware, createMatch);
roomsRouter.get('/getMatchInfo', fetchMatchInfo);

export default roomsRouter;