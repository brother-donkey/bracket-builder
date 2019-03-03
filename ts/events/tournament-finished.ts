import { IGame, IPlayer } from "../types";

export function setupTournamentFinishedEvent(players: IPlayer[]) {
    window.addEventListener('TournamentFinishedEvent', (e: CustomEvent) => {
        const finishedGame = e.detail as IGame;
        console.log(finishedGame);
        console.log('We are done here.');
        const overlay = document.getElementById('tournament-finished-animated-overlay') as HTMLElement;
        renderTournamentResults(overlay, finishedGame, players);
    });
}

export function renderTournamentResults(container: HTMLElement, game: IGame, players: IPlayer[]): HTMLElement {
    const winnerNameElt = container.querySelector('.congrats-winner-name') as HTMLElement;
    winnerNameElt.textContent = `${game.winner.name}!`;

    container.hidden = false;
    const star = container.querySelector('.fas.fa-star') as HTMLSpanElement;
    const winnerElt = container.querySelector('.congrats-winner') as HTMLSpanElement;

    star.classList.add('pop-once');
    winnerElt.classList.add('appear-from-bottom')

    const button = document.createElement('button');
    button.textContent = 'Show full results';
    button.classList.add('show-results');
    button.classList.add('button');
    button.onclick = () => {
        hideTournamentFinishedModal(container);
        renderTournamentSummary(game, players);
    };

    const animationContainer = container.querySelector('.t-f-animation');
    animationContainer.insertAdjacentElement('beforeend', button);
    button.classList.add('fade-in');

    return container;
}

export function hideTournamentFinishedModal(element: HTMLElement) {
    element.hidden = true;
}

export function renderTournamentSummary(tournament: IGame, players: IPlayer[]) {
    // renderWinnerContainer -> elt that says, hooray this person won
    // render table of players minus bys
    // skip if (isBye)

    const table = document.createElement('table') as HTMLTableElement;
    const playersSorted = players.sort((a, b) => a.record.wins > b.record.wins ? -1 : 1);
    console.log(playersSorted);
}