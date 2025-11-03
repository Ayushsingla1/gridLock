import { Dispatch, RefObject, SetStateAction, useState } from "react"
import { cursorPositions, Match} from "@/types/gameTypes"
import ShowTyping from "./showTyping"
import { listenTypingSocket } from "./utils/socketFn"
import { User } from "lucide-react"

const paragraph = "Lorem ips dolor sit amet consectetur adipiscing elit."
// const paragraph = "Lorem ips dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos."

export default function RenderMatch({
    roomId,
    setLoadingDetails,
    matchDetails,
    setMatchDetails,
    socketRef
}: {
    roomId: string,
    setLoadingDetails: Dispatch<SetStateAction<boolean>>
    matchDetails: Match | null,
    setMatchDetails: Dispatch<SetStateAction<Match | null>>
    socketRef: RefObject<WebSocket | null>
}) {
    const [user1Positions, setUser1Position] = useState<cursorPositions>({
        currentWord: 0,
        pointerPos: 0,
        prevLetters: 0
    });

    const [user2Positions, setUser2Position] = useState<cursorPositions>({
        currentWord: 0,
        pointerPos: 0,
        prevLetters: 0
    });

    if (socketRef.current) {
        listenTypingSocket(socketRef.current, matchDetails, setUser1Position, setUser2Position, setLoadingDetails, roomId, setMatchDetails)
    }

    return <div className="w-full h-full flex flex-col gap-y-10 p-3">
            {/* Player 1 Area */}
            <div className="flex flex-col w-full items-start justify-center gap-y-4">
                <div className="flex items-center gap-x-3 px-2">
                    <User className="h-7 w-7 text-cyan-400" />
                    <div className="text-2xl font-semibold text-slate-200 tracking-wide">{matchDetails?.user1_Id}</div>
                </div>
                <ShowTyping userIdx={0} position={user1Positions} paragraph={paragraph} />
            </div>

            {/* Player 2 Area */}
            <div className="flex flex-col w-full items-start justify-center gap-y-4">
                 <div className="flex items-center gap-x-3 px-2">
                    <User className="h-7 w-7 text-pink-400" />
                    <div className="text-2xl font-semibold text-slate-200 tracking-wide">{matchDetails?.user2_Id}</div>
                </div>
                <ShowTyping userIdx={1} position={user2Positions} paragraph={paragraph} />
            </div>
        </div>
}