
export interface IPlayer {
    name: string;
    seed: number;
    record: IRecord;
    isBye: boolean;
}

export interface ITBAPlayer {
    name: string;
    seed: null;
    record: null;
    isBye: boolean;
}

export interface Tourney {
    name: string;
    numberOfPlayers: number;
    generateBracket: () => {};
}

export interface IGame {
    id: number;
    player1: IPlayer;
    player2: IPlayer;
    declareWinner: (player: IPlayer, score: [number, number]) => IPlayer;
    winner: IPlayer | null;
    loser: IPlayer | null;
    finished: boolean;
    prelims: any[];
    round: number;
    parent?: IGame | null;
    score: IFinalScore | null;
    hasBye: boolean;
    winningScore: number;
    losingScore: number;
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

export interface IFinalScore {
    winningScore: number;
    losingScore: number;
}