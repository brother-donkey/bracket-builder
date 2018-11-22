import { IGame, IPlayer } from "./types";
import { addResultIcon } from "./setup";

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

export function setUpWinnerDeclaredEvent() {
    window.addEventListener('WinnerDeclaredEvent', (e: CustomEvent) => {
        const { detail } = e;
        const { id, winner, loser, score } = detail as IGame;
        const elt = findGameElement(id);
        const finishGameButton = elt.querySelector('.finish-game');
        const winnerElt = findPlayerElement(elt, winner);
        const loserElt = findPlayerElement(elt, loser);

        finishGameButton.innerHTML = `<span>${score.winningScore} - ${score.losingScore}</span>`;
        winnerElt.classList.remove('loser');
        winnerElt.classList.add('winner');
        addResultIcon(winnerElt, true);
        addResultIcon(loserElt, false);
    });
}

export function findGameElement(id: number): HTMLElement {
    return document.querySelector(`[data-game-id="${id}"]`);
}

export function findPlayerElement(container: HTMLElement, player: IPlayer): HTMLElement {
    return container.querySelector(`[data-player-name="${player.name}"]`);
}