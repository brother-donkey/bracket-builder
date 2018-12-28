import { IFinalScore, IGame, IPlayer } from "./types";

export class Game implements IGame {
    constructor(player1: IPlayer, player2: IPlayer, prelims: any[], id: number, round: number) {
        this.player1 = player1;
        this.player2 = player2;
        this.finished = false;
        this.winner = null;
        this.loser = null;
        this.prelims = prelims;
        this.id = id;
        this.round = round;
        this.hasBye = (player1.isBye || player2.isBye) ? true : false;
    }

    id: number;
    player1: IPlayer;
    player2: IPlayer;
    numberOfPlayers: number;
    finished: boolean;
    winner: IPlayer | null;
    loser: IPlayer | null;
    prelims: any[];
    round: number;
    parent: IGame | null;
    score: IFinalScore | null;
    hasBye: boolean;

    declareWinner = (winner: IPlayer, score: [number, number]) => {


        const winningScore = score[0] > score[1] ? score[0] : score[1];
        const losingScore = score[0] > score[1] ? score[1] : score[0];
        this.score = {
            winningScore,
            losingScore
        };

        this.winner = winner;
        this.loser = this.winner === this.player1 ? this.player2 : this.player1;

        const pointDifference = Math.abs(score[0] - score[1]);

        this.winner.record.playersBeaten.push(this.loser.name)
        this.winner.record.wins++;
        this.winner.record.pointDifferential += pointDifference;

        this.loser.record.losses++;
        this.loser.record.playersLostTo.push(this.winner.name);
        this.loser.record.pointDifferential -= pointDifference;

        // check for the end of the tournament
        if (!this.parent) {
            const tournamentFinishedEvent = new CustomEvent('TournamentFinishedEvent', {
                "detail": this
            });

            window.dispatchEvent(tournamentFinishedEvent);

            return this.winner;
        }

        // otherwise mark the game's winner
        const winnerDeclaredEvent = new CustomEvent('WinnerDeclaredEvent', {
            "detail": this
        });

        if (this.parent) {
            if (this.parent.prelims[0].id === this.id) {
                this.parent.player1 = winner;
            } else if (this.parent.prelims[1].id === this.id) {
                this.parent.player2 = winner;
            }
        }

        window.dispatchEvent(winnerDeclaredEvent);
        return this.winner;
    }
}
