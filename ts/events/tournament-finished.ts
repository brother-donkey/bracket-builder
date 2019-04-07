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
    const tournamentElement = document.getElementById('tourney') as HTMLMainElement;
    const tableWrapper = document.createElement('div');
    tableWrapper.classList.add('table-wrapper');
    const tableElement = document.createElement('table') as HTMLTableElement;
    tableElement.classList.add('results-table');
    tableWrapper.append(tableElement);
    const playersSorted = players.sort((a, b) => a.record.wins > b.record.wins ? -1 : 1);
    const playersWithoutByes = playersSorted.filter(p => !p.isBye);
    console.log(playersWithoutByes);

    tournamentElement.insertAdjacentElement('beforebegin', tableWrapper);
    addTournamentFinishedTableHeaders(tableElement);
    generatePlayerTableData(playersWithoutByes, tableElement);
}

export function addTournamentFinishedTableHeaders(tableElement: HTMLTableElement) {
    const insertElt = getInsertionElement(tableElement);

    insertElt.insertAdjacentHTML('afterbegin', `
        <tr>
            <th>Name</th>
            <th>Place</th>
            <th>Seed</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Point Diff</th>
            <th>Beaten by</th>
            <th>Defeated by</th>
        </tr>
    `);
}

export function generatePlayerTableData(players: IPlayer[], tableElement: HTMLTableElement) {
    const insertElt = getInsertionElement(tableElement);
    players.forEach((player, i) => {
        const { name, seed, record: { wins, losses, pointDifferential, playersBeaten, playersLostTo } } = player;
        insertElt.insertAdjacentHTML('beforeend', `
        <tr>
            <td>${name}</td>
            <td>${i + 1}</td>
            <td>${seed}</td>
            <td>${wins}</td>
            <td>${losses}</td>
            <td>${pointDifferential}</td>
            <td>${playersBeaten.join(', ')}</td>
            <td>${playersLostTo.join(', ')}</td>
        </tr>
        `);
    })
}
function getInsertionElement(tableElement: HTMLTableElement): HTMLElement {
    const body = tableElement.querySelector('tbody');
    return body || tableElement;
}

