import { IPlayer, BracketItem, IGame } from "./types";
import { Player, TBAPlayer } from "./player";
import { Game } from "./game";
import { gameReadyToPlay } from "./render";
import { setUpGameFinishedEvent } from "./events";

export let gameId: number = 0;

export function createBracket(arr: IPlayer[]) {

    if (arr.length <= 2) {
        return arr;
    }

    const dividingIndex = Math.floor(arr.length / 2) - 1;
    const leftBracket = [];
    const rightBracket = [];

    arr.forEach((competitor, i) => {
        if (i <= dividingIndex) {
            if (i % 2 === 0) {
                rightBracket.push(competitor);
            } else {
                leftBracket.push(competitor);
            }
        }

        if (i > dividingIndex) {
            if (i % 2 === 0) {
                leftBracket.push(competitor);
            } else {
                rightBracket.push(competitor);
            }
        }
    });

    const bracket = [createBracket(leftBracket), createBracket(rightBracket)];
    return bracket;
}

export function createGame(bracket: BracketItem, round: number): IGame {

    // bottom level of games, no parent

    if (!Array.isArray(bracket[0]) && !Array.isArray(bracket[1])) {
        const player1 = bracket[0] as IPlayer;
        const player2 = bracket[1] as IPlayer;

        return new Game(
            new Player(player1.name, player1.seed),
            new Player(player2.name, player2.seed),
            [],
            gameId += 1,
            round
        )
    }

    const previousRound = round - 1;

    // games that are part of later rounds

    return new Game(
        new TBAPlayer(),
        new TBAPlayer(),
        [createGame((bracket[0] as any), previousRound), createGame((bracket[1] as any), previousRound)],
        gameId += 1,
        round
    );
}

export function addByes(arr: IPlayer[]) {
    const remainder = 4 - arr.length % 4;

    // determine if divisible by 4
    if (remainder !== 0) {
        for (let i = 0; i < remainder; i++) {
            arr.push(new Player(`Bye ${i}`, 0)); // push in some meaningless items to give top seeds a by
        }
    }
    return arr;
}

export function flattenGames(game: IGame, arr: IGame[]): IGame[] {
    arr.push(game);

    if (game.prelims.length) {
        game.prelims.forEach(prelim => {
            flattenGames(prelim, arr);
        });
    }

    return arr;
}

export function sortByRound(gameArray: IGame[]) {
    return gameArray.sort((a, b) => {
        if (a.round > b.round) {
            return 1;
        } else {
            return -1;
        }
    })
}

export function assignParentGames(game: IGame): IGame {
    if (game.prelims.length) {
        game.prelims.forEach(prelim => {
            prelim.parent = game;
            assignParentGames(prelim);
        });
    }
    return game;
}

export function renderGamesInRoundContainers(games: IGame[], outerContainer: HTMLElement) {
    const sortedGames = sortByRound(games);

    sortedGames.forEach(game => {
        const ready = gameReadyToPlay(game);
        const readyClass = ready ? 'ready' : '';
        const container = document.querySelector(`[data-round-number="${game.round}"]`);
        container.insertAdjacentHTML('beforeend', `
        <article id="game-${game.id}" class="game box-shadow-1 ${readyClass}" data-game-id="${game.id}">
            <div class="player" data-player-name="${game.player1.name}" data-player-by="${playerIsBy(game.player1)}">
                <span class="seed is-higher">${game.player1.seed || ''}</span><span class="player-name">${game.player1.name}</span>
            </div>
            <div class="player" data-player-name="${game.player2.name}" data-player-by="${playerIsBy(game.player2)}">
                <span class="seed is-lower">${game.player2.seed || ''}</span><span class="player-name">${game.player2.name}</span>
            </div>
            <button aria-label="finish the game between ${game.player1.name} and ${game.player2.name}" class="finish-game" data-game-id="${game.id}"><span class="chevron" aria-hidden="true"></span></button>
        </article>
        `);
    });
}

export function addResultIcon(element: HTMLElement, winner: boolean) {
    // add to winning .player-name

    element.insertAdjacentHTML('beforeend', `
        <i class="fas ${winner ? 'fa-star' : 'fa-skull'}"></i> 
    `);
    return element;
}

export function playerIsBy(player: IPlayer): boolean {
    return player.name.indexOf('By ') !== -1 ? true : false;
}