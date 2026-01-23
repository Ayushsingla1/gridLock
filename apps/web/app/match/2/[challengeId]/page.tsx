import Nav from "@/components/ui/nav";
import Chess from "./chess";

type TypeParams = {
  params: Promise<{
    challengeId: string;
  }>;
};

export default async function ChessPage({ params }: TypeParams) {
  const roomId = (await params).challengeId;

  return (
    <div className="min-h-screen w-screen flex flex-col gap-y-4">
      <Chess roomId={roomId} isSpectator={false} />
    </div>
  );
}
