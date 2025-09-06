import { Router } from "express";
import { acceptChallenge, getChallengedMatches } from "./userControllers/userGames";


const userRouter: Router = Router();

userRouter.get('/getMatches', getChallengedMatches);
userRouter.post('/acceptChallenge', acceptChallenge)


export default userRouter