export enum role {
    Player,
    Spectator
}

export interface typingRecMsg {
    pointerPos: number,
    prevLetters: number,
    currentWord: number,
    user: string,
    gameId?: string,
    challengeId?: string
}

export type Match = {
  gameId: string;
  user1_Id: string;
  user2_Id: string;
  status: 'Pending' | 'Scheduled' | 'Completed';
  createdAt: Date;
  ExpiresAt: Date;
};

export interface cursorPositions{
    pointerPos: number,
    prevLetters: number,
    currentWord: number, 
}