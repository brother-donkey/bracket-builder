import { IPlayer, IGame } from "./types";

export class Game implements IGame {
    constructor(player1: IPlayer, player2: IPlayer, prelims: any[]) {
        this.player1 = player1;
        this.player2 = player2;
        this.finished = false;
        this.winner = null;
        this.loser = null;
        this.prelims = prelims;
    }

    id: string;
    player1: IPlayer;
    player2: IPlayer;
    numberOfPlayers: number;
    finished: boolean;
    winner: IPlayer | null;
    loser: IPlayer | null;
    prelims: any[];

    declareWinner = (winner: IPlayer, score: [number, number]) => {
        this.winner = winner;
        this.loser = this.winner === this.player1 ? this.player2 : this.player1;

        const pointDifference = Math.abs(score[0] - score[1]);

        this.winner.record.playersBeaten.push(this.loser.name)
        this.winner.record.wins++;
        this.winner.record.pointDifferential += pointDifference;

        this.loser.record.losses++;
        this.loser.record.playersLostTo.push(this.winner.name);
        this.loser.record.pointDifferential -= pointDifference;

        return this.winner;
    }
}
