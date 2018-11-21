import { IGame } from "./types";

export function setUpGameFinishedEvent(games: IGame[]) {
    window.addEventListener('click', e => {
        const target = e.target as HTMLElement;
        const gameElt = target.closest('.game') as HTMLElement;
        if (gameElt && gameElt.classList.contains('ready')) {
            e.preventDefault();
            const [match] = games.filter(game => game.id.toString() === gameElt.dataset.gameId);
        }
    });
}

// 