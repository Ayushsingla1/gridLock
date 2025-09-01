import e, { Router } from "express";
import { createMatch } from "./gameControllers/roomCreation";
import { fetchMatchInfo } from "./gameControllers/matchInfor";

const roomsRouter: Router = Router();

roomsRouter.post('/createMatch', createMatch);
roomsRouter.get('/getMatchInfo', fetchMatchInfo);

export default roomsRouter;