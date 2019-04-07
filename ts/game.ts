import { currentPlayers } from ".";
import { awaitModalConfirmation, populateModalContent, redeclarationModalConfig, showModal } from "./modal";
import { resetRecordOnRedeclaredGame } from "./reset";
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
    losingScore: number;
    winningScore: number;

    redeclareGame = async (winner: IPlayer, score: [number, number]) => {

        if (this.finished && winner.name !== this.winner.name) {

            resetRecordOnRedeclaredGame(this.winner, this.player1, this.player2, true, this.winningScore, this.losingScore);

            const warningModal = await populateModalContent(redeclarationModalConfig);
            showModal(warningModal);

            awaitModalConfirmation(warningModal, () => {

                window.dispatchEvent(new CustomEvent('GameRedeclarationEvent', {
                    detail: this
                }));

                // runs when we click 'accept
                this.finished = false;
                // reset their status 
                // their UI

                this.declareWinner(winner, score);
            });
        }

        if (this.finished && winner.name === this.winner.name) {
            // the score has been updated but the winner is the same, might not be worth bothering with this branch
            // recalculate points differential either way

            const previousWinningScore = this.score[0] > this.score[1] ? this.score[0] : this.score[1];
            const previousLosingScore = this.score[0] > this.score[1] ? this.score[1] : this.score[0];

            resetRecordOnRedeclaredGame(this.winner, this.player1, this.player2, false, previousWinningScore, previousLosingScore);
            return;
        }
    }

    declareWinner = (winner: IPlayer, score: [number, number]) => {
        debugger;
        if (this.finished) {
            this.redeclareGame(winner, score);
        }

        this.finished = true;

        const winningScore = score[0] > score[1] ? score[0] : score[1];
        const losingScore = score[0] > score[1] ? score[1] : score[0];
        this.score = {
            winningScore,
            losingScore
        };

        this.winner = winner;
        this.loser = this.winner === this.player1 ? this.player2 : this.player1;

        if (!this.loser.isBye) {
            this.winningScore = winningScore;
            this.losingScore = losingScore;

            const pointDifference = Math.abs(score[0] - score[1]);

            this.winner.record.playersBeaten.push(this.loser.name)
            this.winner.record.wins++;
            this.winner.record.pointDifferential += pointDifference;

            this.loser.record.losses++;
            this.loser.record.playersLostTo.push(this.winner.name);
            this.loser.record.pointDifferential -= pointDifference;
        }

        // check for the end of the tournament
        if (!this.parent) {
            debugger;
            const tournamentFinishedEvent = new CustomEvent('TournamentFinishedEvent', {
                "detail": this
            });

            const winnerDeclaredEvent = new CustomEvent('WinnerDeclaredEvent', {
                "detail": this
            });

            window.dispatchEvent(winnerDeclaredEvent);

            window.dispatchEvent(tournamentFinishedEvent);

            return this.winner;
        }

        updatePlayerRecords([this.winner, this.loser]);

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

export function updatePlayerRecords(playersToUpdate: IPlayer[]) {
    debugger;
    playersToUpdate.forEach(player => {
        debugger;
        const playerIndex = currentPlayers.findIndex(item => item.id === player.id);
        currentPlayers[playerIndex] = player;
    });
}