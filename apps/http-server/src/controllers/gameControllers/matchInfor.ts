import prisma from "@repo/db/dbClient";
import { Response, Request } from "express"

export const fetchMatchInfo = async (req:Request, res:Response) => {
    console.log(req.query);
    const {roomId} = req.query;
    
    try {
        const roomDetails = await prisma.match.findFirst({
            where: {
                id: roomId as string
            },
        })

        if(roomDetails == null){
            res.status(404).json({
                success: false,
                message: "match not found!"
            })
            return;
        }

        res.status(200).json({
            success: true,
            roomDetails
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })    
    }
}