import e, { Router } from "express";
import { createMatch } from "./gameControllers/roomCreation";

const roomsRouter: Router = Router();

roomsRouter.post('/createMatch', createMatch);

export default roomsRouter;