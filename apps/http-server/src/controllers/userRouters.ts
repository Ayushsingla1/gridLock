import { Router } from "express";
import { getChallengedMatches } from "./userControllers/userGames";


const userRouter: Router = Router();

userRouter.get('/getMatches', getChallengedMatches);


export default userRouter