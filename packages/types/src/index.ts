export interface MatchSchema {
  status: "Pending" | "Completed" | "Scheduled" | "rejected";
  id: string;
  createdAt: Date;
  ExpiresAt: Date;
  user1_Id: string;
  user2_Id: string;
  gameId: string;
}
