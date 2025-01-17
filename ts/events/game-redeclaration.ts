import { TBAPlayer } from "../player";
import { removeStarOrSkull } from "../reset";
import { IGame } from "../types";

export function setUpGameRedeclarationEvent() {
    window.addEventListener('GameRedeclarationEvent', (e: CustomEvent) => {
        const redeclaredGame = e.detail as IGame;
        const gameContainer = document.getElementById(`game-${redeclaredGame.id}`)

        removeStarOrSkull(gameContainer)
        resetParentGamesStatuses(redeclaredGame);
    });
}

export function resetParentGamesStatuses(game: IGame) {
    let isFirstGame = true;
    const previousWinner = game.loser.name;

    while (game) {
        // reset the games upcoming
        if (game.parent) {
            game.parent.finished = false;
        }

        const tbdPlayer = new TBAPlayer();
        const gameElt = document.getElementById(`game-${game.id}`) as HTMLElement;

        const playerElt = gameElt.querySelector(`#game-${game.id} [data-player-name="${previousWinner}"`) as HTMLElement;
        if (playerElt) {
            playerElt.classList.remove('complete-game');
            const seed = playerElt.querySelector('.seed') as HTMLElement;
            const name = playerElt.querySelector('.player-name') as HTMLElement;

            if (!isFirstGame) {
                seed.textContent = '';
                seed.classList.add('fas');
                seed.classList.add('fa-circle');

                name.textContent = tbdPlayer.name;
                name.dataset.playerName = 'TBD';
            }
        }

        const players = Array.from(gameElt.querySelectorAll(`#game-${game.id} .player`)) as HTMLElement[];
        const icons = Array.from(gameElt.querySelectorAll('fas')) as HTMLElement[];

        const finishGame = gameElt.querySelector('.finish-game');

        if (finishGame) {
            finishGame.innerHTML = '<span class="chevron" aria-hidden="true"></span>';
            finishGame.classList.remove('scored');
        }

        icons.forEach(iconElt => {
            iconElt.parentElement.removeChild(iconElt);
        });

        if (!isFirstGame && gameElt) {
            gameElt.classList.remove('ready');
            gameElt.classList.remove('complete-game');
        }

        players.forEach(player => {
            player.classList.remove('winner');
            player.classList.remove('loser');
            removeStarOrSkull(player);
        });

        isFirstGame = false;

        if (!game.parent) {
            break;
        }

        game = game.parent;
    }
}
