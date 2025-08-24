import { WebSocketServer } from "ws";


const server = new WebSocketServer({port : 8080});


server.on("connection",(wss) => {
    wss.on("message",(data) => {
        const {msg} = JSON.parse(String(data));

        console.log(msg);
    })
})