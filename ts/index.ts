import { ITBAPlayer, IPlayer, IGame, IRecord, BracketItem } from "./types";
import { Game } from "./game";
import { Player, TBAPlayer } from "./player";
import { createBracket, addByes, createGame } from "./setup";
import { getNumberOfGames } from "./utilities";
import { renderGame } from "./render";


// just make some players

const arr = [] as IPlayer[];

for (let i = 0; i < 13; i++) {
    const player = new Player(`Player ${i + 1}`, 1);
    arr.push(player);
}

// create tourney strucutre
const completeArr = addByes(arr) as IPlayer[];
const numberOfGames = getNumberOfGames(completeArr.length);
let currentGameId = numberOfGames; // decrement as games are assigned their ids

const baseBracket = createBracket(arr);
const tourney = createGame(baseBracket); // recursively creates all games

console.log({ tourney });

const tourneyElt = document.getElementById('tourney') as HTMLMainElement;
renderGame(tourney, tourneyElt);