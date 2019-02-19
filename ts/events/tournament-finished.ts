import { IGame } from "../types";

export function setupTournamentFinishedEvent() {
    window.addEventListener('TournamentFinishedEvent', (e: CustomEvent) => {
        const finishedGame = e.detail as IGame;
        console.log(finishedGame);
        console.log('We are done here.');
        const overlay = document.getElementById('tournament-finished-animated-overlay') as HTMLElement;
        renderTournamentResults(overlay, finishedGame);
    });
}

export function renderTournamentResults(container: HTMLElement, game: IGame): HTMLElement {
    const winnerNameElt = container.querySelector('.congrats-winner-name') as HTMLElement;
    winnerNameElt.textContent = game.winner.name;

    container.hidden = false;
    const star = container.querySelector('.fas.fa-star') as HTMLSpanElement;
    const winnerElt = container.querySelector('.congrats-winner') as HTMLSpanElement;

    star.classList.add('pop-once');
    winnerElt.classList.add('appear-from-bottom')

    return container;
}