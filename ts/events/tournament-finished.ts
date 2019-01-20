import { IGame } from "../types";

export function setupTournamentFinishedEvent() {
    window.addEventListener('TournamentFinishedEvent', (e: CustomEvent) => {
        const finishedGame = e.detail as IGame;
    });
}