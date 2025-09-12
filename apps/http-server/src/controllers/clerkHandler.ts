import prisma from "@repo/db/dbClient";
import { Router } from "express";
import { Webhook } from "svix";


export const clerkHandler : Router = Router();

clerkHandler.post('/webhook/clerk',async(req,res) => {
        const payload = req.body;
        const headers = req.headers;
    
        const body = JSON.stringify(payload);
    
        console.log(headers)
    
        const svix_id = headers['svix-id'] as string
        const svix_timestamp = headers['svix-timestamp'] as string
        const svix_signature = headers['svix-signature'] as string
    
        if (!svix_id || !svix_timestamp || !svix_signature) {
            return new Response('Error: Missing Svix headers', {
                status: 400,
            })
        }
    
        const wh = new Webhook(process.env.WEBHOOK_SECRET!);
    
        let evt: any;
        try {
            evt = wh.verify(body, {
                'svix-id': svix_id,
                'svix-timestamp': svix_timestamp,
                'svix-signature': svix_signature,
            })
        } catch (err) {
            console.error("Webhook verification failed:", err);
            return res.status(400).json({ error: "Invalid signature" });
        }
    
        try {
    
            console.log(evt);
            if (evt.type === "user.created") {
                const result = await prisma.user.create({
                    data: {
                        // id: (evt.data.web3_wallets[0].web3_wallet as string)
                        username : evt.data.username,
                        name : evt.data.first_name + evt.data.last_name
                    }
                })
    
                console.log(result);
                res.status(200).json({ received: true });
            }
        } catch (e) {
            console.log(e);
            res.status(501).json({
                msg: "user unable to create"
            })
        }
    })
;