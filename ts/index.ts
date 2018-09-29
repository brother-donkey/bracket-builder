import { renderGame } from "./game-ui";
import { renderSetup } from "./setup-ui";

// basic user flow is
// 1. land on page
// 2. enter tourny info, number of players, names of players, their seeds
// 3. tourniment is generated
// 4. games happen in the correct order, after each game user declares a winner, puts in a score
// 5. game is declared complete, winner advances to the next game

// play
// reverse order
// make two players
// make a game
// make unit tests to ensure it works
// make tourniment stuff after

export interface IPlayer {
    name: string;
    seed: number;
    record: IRecord;
}

export interface Tourney {
    name: string;
    numberOfPlayers: number;
    generateBracket: () => {};
}

export interface IGame {
    id: string;
    player1: IPlayer;
    player2: IPlayer;
    declareWinner: (player: IPlayer, score: [number, number]) => IPlayer;
    winner: IPlayer | null;
    loser: IPlayer | null;
    finished: boolean;
}

export interface IRecord {
    wins: number;
    losses: number;
    pointDifferential: number;
    playersLostTo: string[];
    playersBeaten: string[];
}

class Player implements IPlayer {
    constructor(name: string, seed?: number) {
        this.name = name;
        this.seed = seed || 0;
        this.record = {
            wins: 0,
            losses: 0,
            pointDifferential: 0,
            playersLostTo: [],
            playersBeaten: []
        };
    }

    name: string;
    seed: number;
    record: IRecord;
};

class Game implements IGame {
    constructor(player1: IPlayer, player2: IPlayer) {
        this.player1 = player1;
        this.player2 = player2;
        this.finished = false;
        this.winner = null;
        this.loser = null;
    }

    id: string;
    player1: IPlayer;
    player2: IPlayer;
    numberOfPlayers: number;
    finished: boolean;
    winner: IPlayer | null;
    loser: IPlayer | null;

    declareWinner = (winner: IPlayer, score: [number, number]) => {
        if (winner !== this.player1 && winner !== this.player2) {
            console.error(winner + 'is not even playing');
        }

        this.winner = winner;
        this.loser = this.winner === this.player1 ? this.player2 : this.player1;

        const pointDifference = Math.abs(score[0] - score[1]);

        this.winner.record.playersBeaten.push(this.loser.name)
        this.winner.record.wins++;
        this.winner.record.pointDifferential += pointDifference;

        this.loser.record.losses++;
        this.loser.record.playersLostTo.push(this.winner.name);
        this.loser.record.pointDifferential -= pointDifference;

        return this.winner;
    }
}

// create 2 players

const will = new Player('Will', 1);
const elaine = new Player('Elaine', 1);
const jedd = new Player('Jedd', 1);

const game = new Game(will, elaine);
game.declareWinner(will, [21, 19]);

const game2 = new Game(will, jedd);
game2.declareWinner(will, [21, 9]);

const game3 = new Game(elaine, jedd);
game2.declareWinner(elaine, [21, 9]);

// renderGame(document.getElementById('main-container'), game);

// console.log({ game });
// console.log({ will });
// console.log({ elaine })
// document.querySelector('.player-name').textContent = will.name;

// renderSetup();



const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const completeArr = addByes(arr);

const numberOfGames = getNumberOfGames(completeArr.length);

function createBracket(arr: Number[]) {
    if (arr.length <= 2) {
        return arr;
    }

    const dividingIndex = Math.floor(arr.length / 2) - 1;
    const leftBracket = [];
    const rightBracket = [];

    arr.forEach((compentitor, i) => {
        if (i <= dividingIndex) {
            if (i % 2 === 0) {
                rightBracket.push(compentitor);
            } else {
                leftBracket.push(compentitor);
            }
        }

        if (i > dividingIndex) {
            if (i % 2 === 0) {
                leftBracket.push(compentitor);
            } else {
                rightBracket.push(compentitor);
            }
        }
    })

    const bracket = [createBracket(leftBracket), createBracket(rightBracket)];
    return bracket;
}

function renderBracket(arr: number[], container: HTMLElement) {
    if (arr.length !== 2) {
        console.error("The array is wrong.");
    }

    renderGame(arr, container);

}


function renderGame(tupple: any[], container: HTMLElement) {

    container.insertAdjacentHTML('beforeend', `
    <p>Game ${JSON.stringify(tupple)}<p>
    `)
    return tupple;
}


function addByes(arr: any[]) {
    const remainder = 4 - arr.length % 4;

    // determine if divisible by 4
    if (remainder !== 0) {
        for (let i = 0; i < remainder; i++) {
            arr.push(99); // push in some meaning less items to give top seeds a by
        }
    }
    return arr;
}

function getNumberOfGames(num: number): number {
    let numberOfGames = 0;
    num /= 2;
    while (num > 1) {
        numberOfGames += num;
        num /= 2;
    }
    return num;
}


renderBracket(createBracket(arr), document.getElementById('bracket'));

