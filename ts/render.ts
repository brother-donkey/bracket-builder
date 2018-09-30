import { IGame } from "./types";

export function renderGame(game: IGame, container: HTMLElement) {
    const gameElt = document.createElement('article');
    gameElt.insertAdjacentHTML('afterbegin', `
    <div class="game" data-uid-game-id="${game.id}">
        <div class="game-name">${game.id}</div>
        <div class="winner"></div>
        <div class="player-container">
            <div class="player">${game.player1.name}</div>
            <div class="score">Score</div>
            <div class="player">${game.player2.name}</div>
        </div>
    </div>
    `)

    container.appendChild(gameElt);
}