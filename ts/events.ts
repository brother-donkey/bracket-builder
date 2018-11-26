import { IGame, IPlayer, IFinalScore } from "./types";
import { addResultIcon } from "./setup";
import { inputPlayers } from "./player-input";

export function setUpGameFinishModalEvent(games: IGame[]) {
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
            firstPlayerScore.focus();
        }
    });
}

export function setUpWinnerDeclaredEventListener(games) {
    window.addEventListener('WinnerDeclaredEvent', (e: CustomEvent) => {
        const { detail: finishedGame } = e;
        const { id, winner, loser, score, parent } = finishedGame as IGame;
        const elt = findGameElement(id);
        const finishGameButton = elt.querySelector('.finish-game');
        const winnerElt = findPlayerElement(elt, winner);
        const loserElt = findPlayerElement(elt, loser);

        winnerElt.classList.remove('loser');
        winnerElt.classList.add('winner');
        addResultIcon(winnerElt, true);
        loserElt.classList.remove('winner');
        loserElt.classList.add('loser');
        addResultIcon(loserElt, false);

        const determineWhichIsFirstInDom = elt.querySelector('.winner + .loser');
        const winnerIsFirst = determineWhichIsFirstInDom !== null;

        const buttonScoreHTML = `
            ${winnerIsFirst ? `<div class="scored-winner"><span>${score.winningScore}</span></div>` : `<div class="scored-loser"><span>${score.losingScore}</span></div>`}
            ${winnerIsFirst ? `<div class="scored-loser"><span>${score.losingScore}</span></div>` : `<div class="scored-winner"><span>${score.winningScore}</span></div>`}
        `

        finishGameButton.innerHTML = buttonScoreHTML;
        finishGameButton.classList.add('scored');

        populateParentGame(finishedGame, parent);
    });
}

export function findGameElement(id: number): HTMLElement {
    return document.querySelector(`.game[data-game-id="${id}"]`);
}

export function findPlayerElement(container: HTMLElement, player: IPlayer): HTMLElement {
    return container.querySelector(`[data-player-name="${player.name}"]`);
}

// deals with how form submission of a score

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
                return;
            }

            if (!firstPlayerScore || !secondPlayerScore) {
                alert("You didn't fill out one of the scores.");
                return;
            }

            const gameInfo = document.querySelector('#submit-game-info') as HTMLElement;

            let winnersName = firstPlayerScore > secondPlayerScore ? firstPlayerName.textContent : secondPlayerName.textContent;

            const [match] = games.filter(game => game.id.toString() === gameInfo.dataset.gameId);
            const winner = match.player1.name === winnersName ? match.player1 : match.player2;

            match.declareWinner(winner, [firstPlayerScore, secondPlayerScore]);

            const formContainer = document.querySelector('.form-container') as HTMLElement;
            formContainer.hidden = true;
            const lastClickedGame = document.querySelector('[data-last-focused-game="true"]') as HTMLElement;
            lastClickedGame.focus();

            const gameContainer = document.getElementById(`game-${match.id}`) as HTMLElement;
            gameContainer.classList.add('complete-game');
        }
    });
}

export function isTopPlayerInGame(finishedGame: IGame, nextGame: IGame): boolean {
    return nextGame.prelims[0].id === finishedGame.id;
}

export function populateParentGame(finishedGame: IGame, nextGame: IGame) {
    const isTop = isTopPlayerInGame(finishedGame, nextGame);
    const nextGameElt = document.querySelector(`#game-${nextGame.id}`) as HTMLElement;
    const players = Array.from(nextGameElt.querySelectorAll(`.player`)) as HTMLElement[];
    const index = isTop ? 1 : 0;
    const player = players[index];
    const seed = player.querySelector(`.seed`);
    const playerName = player.querySelector('.player-name');

    playerName.textContent = finishedGame.winner.name;
    seed.textContent = finishedGame.winner.seed.toString();
    player.dataset.playerName = finishedGame.winner.name;

    if (gameElementIsReadyToPlay(nextGameElt, players, nextGame.id)) {
        nextGameElt.classList.add('ready');
    }
}

export function gameElementIsReadyToPlay(gameElt: HTMLElement, playerElts: HTMLElement[], id: number): boolean {
    let isReady = true;

    playerElts.forEach(elt => {
        if (elt.querySelector('.player-name').textContent.indexOf('TBD') !== -1) {
            isReady = false;
        }
    });

    return isReady;
}

export function setUpFocusTracker() {
    window.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;

        if (target.classList.contains('finish-game') || target.closest('.finish-game')) {
            const lastFocused = document.querySelector(`[data-last-focused-game="true"]`) as HTMLElement;
            if (lastFocused) {
                lastFocused.dataset.lastFocusedGame = "false";
            }

            const clickedElement = target.classList.contains('finish-game') ? target : target.closest('.finish-game') as HTMLElement;
            if (clickedElement) {
                clickedElement.dataset.lastFocusedGame = "true";
            }
        }
    })
}

export function setupStartTournamentButtonClick() {
    window.addEventListener('click', e => {
        const target = e.target as HTMLElement;
        if (target.id === 'start-tournament') {
            e.preventDefault();

            const text = document.getElementById('start-tourament-icon');
            const background = document.getElementById('start-tournament-background');

            if (text && background) {
                text.classList.add('start-tournament-animation-icon');
                background.classList.add('start-tournament-animation-background');
                hideInputForm();
            }

            window.dispatchEvent(new CustomEvent('StartTournament', {
                detail: inputPlayers
            }));
        }
    });
}

export function hideInputForm() {
    document.getElementById('player-input-form').style.display = 'none';
}