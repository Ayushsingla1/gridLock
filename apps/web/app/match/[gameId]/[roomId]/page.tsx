import Nav from "@/components/ui/nav"
import GameLogic from "./gameLogic"

interface paramsProps {
    params: {
        gameId: string,
        roomId: string
    }
}

export default async function TypingPage({
    params
}: paramsProps) {
    const gameId = await params.gameId
    const roomId = await params.roomId

    return (
        <div className="min-h-screen w-screen flex flex-col gap-y-4">
            <Nav/>
            <GameLogic gameId={gameId} roomId={roomId}/>
        </div>
    )
}
