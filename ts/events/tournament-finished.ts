import { IGame } from "../types";

export function setupTournamentFinishedEvent() {
    window.addEventListener('TournamentFinishedEvent', (e: CustomEvent) => {
        const finishedGame = e.detail as IGame;
        console.log(finishedGame);
        console.log('We are done here.');
    });
}

export function renderTournamentResults(container: HTMLElement): HTMLElement {

    return container;
}