import { Router } from "express";
import roomsRouter from "./roomRouters";
import XRouter from "./twitterRouters";
import userRouter from "./userRouters";
import { clerkHandler } from "./clerkHandler";

const mainRouter : Router = Router();

mainRouter.use('/room', roomsRouter);
mainRouter.use('/twitter',XRouter);
mainRouter.use('/user',userRouter);
mainRouter.use('/clerk',clerkHandler)

export default mainRouter;