import { Router } from "express";
import { createMatch } from "./gameControllers/roomCreation";
import { fetchMatchInfo } from "./gameControllers/matchInfor";

const roomsRouter: Router = Router();

roomsRouter.post('/contract/createGame', );
roomsRouter.get('/getMatchInfo', fetchMatchInfo);

export default roomsRouter;