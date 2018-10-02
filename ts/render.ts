import { IGame } from "./types";

export function renderGame(game: IGame, container: HTMLElement) {
    const gameElt = document.createElement('article');
    const readyToPlay = gameReadyToPlay(game);

    gameElt.insertAdjacentHTML('afterbegin', `
    <div class="game" data-game-id="${game.id}" ${readyToPlay ? '' : 'hidden'}>
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

    game.prelims.forEach(game => {
        renderGame(game, container);
    });
}

export function selectAllGameElements(): HTMLElement[] {
    return Array.from(document.querySelectorAll('[data-game-id]')) as HTMLElement[];
}

export function gameReadyToPlay(game: IGame) {
    return game.player1.name !== 'TBD' || game.player2.name !== 'TBD';
}