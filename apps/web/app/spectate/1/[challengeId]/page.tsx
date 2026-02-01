import Nav from "@/components/ui/nav";
import SpectateMatch from "./spectateMatch";

type pageProp = {
  params: Promise<{
    challengeId: string;
  }>;
};

export default async function Spectate({ params }: pageProp) {
  const roomId = (await params).challengeId;
  const gameId = 1;
  console.log(roomId, " ", gameId);
  return (
    <div className="w-screen flex flex-col gap-y-10 h-screen">
      <Nav />
      <SpectateMatch roomId={roomId} gameId={gameId} />
    </div>
  );
}
