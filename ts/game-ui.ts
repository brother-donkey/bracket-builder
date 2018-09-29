import { IGame } from '../main';

export function renderGame(container: HTMLElement, game: IGame) {
    return container.innerHTML = `
        <div id="${game.id}" class="game">
            <div class="player-one">
                <h3>${game.player1.name}</h3>
            </div>
            <div class="player-two">
                <h3>${game.player2.name}</h3>
            </div>
        </div>
    `
}