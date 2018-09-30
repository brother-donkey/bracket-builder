import { IPlayer, BracketItem, IGame } from "./types";
import { Player, TBAPlayer } from "./player";
import { Game } from "./game";

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

export function createGame(bracket: BracketItem): IGame {
    // if its an array of arrays, make a game with TBA players

    if (Array.isArray(bracket[0]) && Array.isArray(bracket[1])) {
        return new Game(
            new TBAPlayer(),
            new TBAPlayer,
            [createGame((bracket[0] as any)), createGame((bracket[1] as any))],
            gameId += 1);
    }

    const player1 = bracket[0] as IPlayer;
    const player2 = bracket[1] as IPlayer;

    return new Game(
        new Player(player1.name, player1.seed),
        new Player(player2.name, player2.seed),
        [],
        gameId += 1
    )
}

export function addByes(arr: IPlayer[]) {
    const remainder = 4 - arr.length % 4;

    // determine if divisible by 4
    if (remainder !== 0) {
        for (let i = 0; i < remainder; i++) {
            arr.push(new Player(`Bye ${i}`, 16)); // push in some meaning less items to give top seeds a by
        }
    }
    return arr;
}