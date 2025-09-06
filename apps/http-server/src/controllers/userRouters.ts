import { Router } from "express";
import { acceptChallenge, cancleReq, getChallengedMatches } from "./userControllers/userGames";


const userRouter: Router = Router();

userRouter.get('/getMatches', getChallengedMatches);
userRouter.post('/acceptChallenge', acceptChallenge)
userRouter.post('/cancelReq', cancleReq)


export default userRouter