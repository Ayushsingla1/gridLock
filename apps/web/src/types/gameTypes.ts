export enum role {
    Player,
    Spectator
}

export interface typingRecMsg {
    isComplete?: boolean,
    pointerPos: number,
    prevLetters: number,
    currentWord: number,
    user: string,
    gameId?: string,
    challengeId?: string
}

export type Match = {
    id: string,
    gameId: string;
    user1_Id: string;
    user2_Id: string;
    winnerId: string
    status: 'Pending' | 'Scheduled' | 'Completed' | 'rejected';
    createdAt: Date;
    ExpiresAt: Date;
};

export interface cursorPositions{
    isComplete?: boolean,
    pointerPos: number,
    prevLetters: number,
    currentWord: number, 
}