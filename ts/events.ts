import { IGame, IPlayer, IFinalScore } from "./types";
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

            const gameInfo = document.querySelector('#submit-game-info') as HTMLElement;
            const gameInfoGame = document.querySelector('#submit-game-info-game');
            const firstPlayerName = document.getElementById('first-player-form-label');
            const secondPlayerName = document.getElementById('second-player-form-label');
            const firstPlayerScore = document.getElementById('first-player-score') as HTMLInputElement;
            const secondPlayerScore = document.getElementById('second-player-score') as HTMLInputElement;

            gameInfoGame.textContent = `Game ${match.id}`;
            gameInfo.dataset.gameId = `${match.id}`;
            firstPlayerName.textContent = match.player1.name;
            secondPlayerName.textContent = match.player2.name;
            firstPlayerScore.value = undefined;
            secondPlayerScore.value = undefined;
        }
    });
}

export function setUpWinnerDeclaredEventListener() {
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
        loserElt.classList.remove('winner');
        loserElt.classList.add('loser');
        addResultIcon(loserElt, false);
    });
}

export function findGameElement(id: number): HTMLElement {
    return document.querySelector(`.game[data-game-id="${id}"]`);
}

export function findPlayerElement(container: HTMLElement, player: IPlayer): HTMLElement {
    return container.querySelector(`[data-player-name="${player.name}"]`);
}

export function setupWinnerDeclaredEvent(games: IGame[]) {
    window.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target && target.classList.contains('submit-game-button')) {
            const form = document.getElementById('submit-game') as HTMLFormElement;
            const { elements } = form;
            e.preventDefault();
            if (!form) {
                return;
            }

            const firstPlayerInput = document.getElementById('first-player-score') as HTMLInputElement;
            const firstPlayerScore = parseInt(firstPlayerInput.value);
            const firstPlayerName = document.getElementById('first-player-form-label') as HTMLLabelElement;

            const secondPlayerInput = document.getElementById('second-player-score') as HTMLInputElement;
            const secondPlayerScore = parseInt(secondPlayerInput.value);
            const secondPlayerName = document.getElementById('second-player-form-label') as HTMLLabelElement;

            if (firstPlayerScore === secondPlayerScore) {
                alert("Scores can't be the same. We don't do ties.");
            }

            if (!firstPlayerScore || !secondPlayerScore) {
                alert("You didn't fill out one of the scores.");
            }

            const gameInfo = document.querySelector('#submit-game-info') as HTMLElement;

            let winnersName = firstPlayerScore > secondPlayerScore ? firstPlayerName.textContent : secondPlayerName.textContent;

            const [match] = games.filter(game => game.id.toString() === gameInfo.dataset.gameId);
            const winner = match.player1.name === winnersName ? match.player1 : match.player2;

            match.declareWinner(winner, [firstPlayerScore, secondPlayerScore]);
        }
    });
}