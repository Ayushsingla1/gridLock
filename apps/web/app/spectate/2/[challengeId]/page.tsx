import Chess from "../../../match/2/[challengeId]/chess";

type pageProp = {
  params: Promise<{
    challengeId: string;
  }>;
};

export default async function Spectate({ params }: pageProp) {
  const roomId = (await params).challengeId;
  const gameId = "chess";
  console.log(roomId, " ", gameId);
  return (
    <div className="w-screen flex flex-col gap-y-10 h-screen">
      <Chess roomId={roomId} isSpectator={true} />
    </div>
  );
}
