import { inputPlayers } from "./player-input";
import { addResultIcon } from "./setup";
import { IGame, IPlayer } from "./types";
import { constrainFocus } from "./utilities";
import * as gamesPlayed from "./games-playered";
import { updateGamesLeftElement } from "./element-updates";

const formSelector = '#submit-game';

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
            secondPlayerScore.focus(); // because I'm a fool, I've put the second one first.
            window.addEventListener('focusin', constrainFocus(formSelector))
        }
    });
}

const handleWinnerDeclaredEvent = (e: CustomEvent) => {
    const { detail: finishedGame } = e;
    const { id, winner, loser, score, parent } = finishedGame as IGame;
    const elt = findGameElement(id);
    const finishGameButton = elt.querySelector('.finish-game');
    const winnerElt = findPlayerElement(elt, winner);
    const loserElt = findPlayerElement(elt, loser);
    winnerElt.classList.remove('loser');
    winnerElt.classList.add('winner');
    loserElt.classList.remove('winner');
    loserElt.classList.add('loser');
    if (!winnerElt.querySelector('.fa-star')) {
        addResultIcon(winnerElt, true);
    }
    if (!loserElt.querySelector('.fa-skull')) {
        addResultIcon(loserElt, false);
    }
    const determineWhichIsFirstInDom = elt.querySelector('.winner + .loser');
    const winnerIsFirst = determineWhichIsFirstInDom !== null;
    const buttonScoreHTML = `
            ${winnerIsFirst ? `<div class="scored-winner"><span>${score.winningScore}</span></div>` : `<div class="scored-loser"><span>${score.losingScore}</span></div>`}
            ${winnerIsFirst ? `<div class="scored-loser"><span>${score.losingScore}</span></div>` : `<div class="scored-winner"><span>${score.winningScore}</span></div>`}
        `;
    finishGameButton.innerHTML = buttonScoreHTML;
    finishGameButton.classList.add('scored');
    if (parent) {
        // * if the tournament isn't over
        populateParentGame(finishedGame, parent);
    }
};
export function setUpWinnerDeclaredEventListener(games) {
    window.addEventListener('WinnerDeclaredEvent', handleWinnerDeclaredEvent);
}

export function findGameElement(id: number): HTMLElement {
    return document.querySelector(`.game[data-game-id="${id}"]`);
}

export function findPlayerElement(container: HTMLElement, player: IPlayer): HTMLElement {
    return container.querySelector(`[data-player-name="${player.name}"]`);
}

// deals with how form submission of a score

export function setupWinnerDeclaredInModalEvent(games: IGame[]) {
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

            const firstPlayerNoInput = firstPlayerScore !== 0 && !firstPlayerScore;
            const secondPlayerNoInput = secondPlayerScore !== 0 && !secondPlayerScore;

            if (firstPlayerNoInput || secondPlayerNoInput) {
                alert("You didn't fill out one of the scores.");
                return;
            }

            const gameInfo = document.querySelector('#submit-game-info') as HTMLElement;

            let winnersName = firstPlayerScore > secondPlayerScore ? firstPlayerName.textContent : secondPlayerName.textContent;

            const [match] = games.filter(game => game.id.toString() === gameInfo.dataset.gameId);
            const winner = match.player1.name === winnersName ? match.player1 : match.player2;

            match.declareWinner(winner, [firstPlayerScore, secondPlayerScore]);

            playCount++;
            updateGamesPlayedElement(playCount);
            updateGamesLeftElement();

            const formContainer = document.querySelector('.form-container') as HTMLElement;
            formContainer.hidden = true;
            const lastClickedGame = document.querySelector('[data-last-focused-game="true"]') as HTMLElement;
            window.removeEventListener('focusin', constrainFocus(formSelector));
            if (lastClickedGame) {
                lastClickedGame.focus();
            }

            const gameContainer = document.getElementById(`game-${match.id}`) as HTMLElement;
            gameContainer.classList.add('complete-game');
        }
    });
}

export function isTopPlayerInGame(finishedGame: IGame, nextGame: IGame): boolean {
    return nextGame.prelims[0].id === finishedGame.id;
}

export function populateParentGame(finishedGame: IGame, nextGame: IGame) {
    const isTop = !isTopPlayerInGame(finishedGame, nextGame);
    const nextGameElt = document.querySelector(`#game-${nextGame.id}`) as HTMLElement;
    const players = Array.from(nextGameElt.querySelectorAll(`.player`)) as HTMLElement[];
    const index = isTop ? 0 : 1;
    const player = players[index];
    const seed = player.querySelector(`.seed`);
    const playerName = player.querySelector('.player-name');

    playerName.textContent = finishedGame.winner.name;
    seed.textContent = finishedGame.winner.seed.toString();
    seed.classList.remove('fas');
    seed.classList.remove('fa-circle');

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
        const closest = target.closest('.finish-game');
        if (closest) {
            if ((closest as HTMLButtonElement).disabled === true) {
                return;
            }
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

            const tourneyElt = document.getElementById('tourney');
            tourneyElt.classList.remove('is-inactive');
            const text = document.getElementById('start-tourament-icon');
            const background = document.getElementById('start-tournament-background');
            const tournamentNameElt = document.getElementById('tournament-name') as HTMLInputElement;
            const tournamentName = tournamentNameElt.value ? tournamentNameElt.value : 'Our bracket';

            if (text && background) {
                showTournamentHeadline(tournamentName);

                text.classList.add('tournament-animation-icon');
                background.classList.add('fullscreen-tournament-animation-background');
                hideInputForm();
            }

            window.dispatchEvent(new CustomEvent('StartTournament', {
                detail: inputPlayers
            }));

            // remove beginning section from the DOM
            const beginSection = document.getElementById('initial-section') as HTMLElement;
            beginSection.parentElement.removeChild(beginSection);
        }
    });
}

export function hideInputForm() {
    document.getElementById('player-input-form').style.display = 'none';
}

export function showTournamentHeadline(name: string) {
    const elt = document.getElementById('tournament-name-heading') as HTMLElement;
    elt.textContent = name;
    elt.parentElement.style.display = 'block';
}

export let playCount: number = 0;

export function updateGamesPlayedElement(gamesPlayed: number) {
    const elt = document.querySelector('.number-games-played') as HTMLElement;
    elt.textContent = gamesPlayed.toString();
}