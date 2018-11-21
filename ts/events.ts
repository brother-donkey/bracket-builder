import { IGame } from "./types";

export function setUpGameFinishedEvent(games: IGame[]) {
    window.addEventListener('click', e => {
        const target = e.target as HTMLElement;
        const gameElt = target.closest('.game') as HTMLElement;
        const formContainer = document.querySelector('.form-container') as HTMLElement;

        if (gameElt && gameElt.classList.contains('ready')) {
            e.preventDefault();
            const [match] = games.filter(game => game.id.toString() === gameElt.dataset.gameId);
            formContainer.hidden = false;

            const gameInfo = document.querySelector('.submit-game-info');
            const gameInfoGame = document.querySelector('.submit-game-info-game');
            const firstPlayerName = document.getElementById('first-player-form-label');
            const secondPlayerName = document.getElementById('second-player-form-label');
            const firstPlayerScore = document.getElementById('first-player-score') as HTMLInputElement;
            const secondPlayerScore = document.getElementById('second-player-score') as HTMLInputElement;

            gameInfoGame.textContent = `Game ${match.id}`;
            firstPlayerName.textContent = match.player1.name;
            secondPlayerName.textContent = match.player2.name;
            firstPlayerScore.value = undefined;
            secondPlayerScore.value = undefined;
            console.log(match.parent);
        }
    });
}
