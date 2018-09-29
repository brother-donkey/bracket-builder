
export interface IPlayer {
    name: string;
    seed: number;
    record: IRecord;
}

export interface ITBAPlayer {
    name: string;
    seed: null;
    record: null;
}

export interface Tourney {
    name: string;
    numberOfPlayers: number;
    generateBracket: () => {};
}

export interface IGame {
    id: string;
    player1: IPlayer;
    player2: IPlayer;
    declareWinner: (player: IPlayer, score: [number, number]) => IPlayer;
    winner: IPlayer | null;
    loser: IPlayer | null;
    finished: boolean;
    prelims: any[];
}

export interface IRecord {
    wins: number;
    losses: number;
    pointDifferential: number;
    playersLostTo: string[];
    playersBeaten: string[];
}

export type PlayerTuple = Array<IPlayer>;
export type BracketItem = Array<PlayerTuple> | PlayerTuple;
