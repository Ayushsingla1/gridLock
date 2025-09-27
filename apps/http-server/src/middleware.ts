
import { Request, Response, NextFunction } from "express";
import { clerkClient } from "@clerk/clerk-sdk-node";

export const middleware = async(req : Request, res : Response, next : NextFunction) => {
    try{

        console.log(req.headers["authorization"]);
        console.log("thi ththnjdk"); 
        const result = await clerkClient.verifyToken(req.headers["authorization"]?.replace("Bearer ","")!,{});
        console.log("hi there");
        console.log(result);
        if(result.sub === req.body.userId){
            next();
        }else{
            return res.status(401).json({
                msg : "userId not matches"
            })
        }
    }catch(e) {
        return res.status(401).json({
            msg : "unauthorized",
            error : e
        })
    }
};