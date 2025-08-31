import Nav from "@/components/ui/nav";
import RenderMatch from "./RenderMatch";


export default async function Spectate({
    params
}: {
    params: {
        roomId: string,
        gameId: string
    }
}){
    const roomId = (await params).roomId;
    const gameId = (await params).gameId;
    console.log(roomId, " ", gameId);
    return <div>
        <Nav/>
        Spectating...
        <RenderMatch roomId={roomId} gameId={gameId}/>
    </div>
}