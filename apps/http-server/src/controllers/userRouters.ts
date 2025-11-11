import { Router } from "express";
import { acceptChallenge, cancleReq, getAllScheduledMatches, getChallengedMatches } from "./userControllers/userGames";
import { middleware } from "../middleware";
import { getUserProfile } from "./userData/userProfile";


const userRouter: Router = Router();

userRouter.get('/getMatches', getChallengedMatches);
userRouter.post('/acceptChallenge', acceptChallenge)
userRouter.post('/cancelReq', cancleReq)
userRouter.get("/getScheduledMatches", getAllScheduledMatches);
userRouter.get("/userProfile",getUserProfile)

export default userRouter