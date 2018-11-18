import { ITBAPlayer, IPlayer, IGame, IRecord, BracketItem } from "./types";
import { Game } from "./game";
import { Player, TBAPlayer } from "./player";
import { createBracket, addByes, createGame } from "./setup";
import { getNumberOfGames } from "./utilities";
import { renderGame, selectAllGameElements } from "./render";
import { playerInputForm, handlePlayerInput, inputPlayers } from './player-input';

// just make some players

window.addEventListener('StartTournament', () => {
    const players = inputPlayers.map(({ name, seed }) => {
        return new Player(name, seed);
    });

    // create tourney strucutre
    const completeArr = addByes(players) as IPlayer[];
    const numberOfGames = getNumberOfGames(completeArr.length);
    let currentGameId = numberOfGames; // decrement as games are assigned their ids

    const baseBracket = createBracket(players);
    const tourney = createGame(baseBracket); // recursively creates all games

    console.log({ tourney });

    const tourneyElt = document.getElementById('tourney') as HTMLMainElement;
    renderGame(tourney, tourneyElt);
})

console.log(selectAllGameElements());

handlePlayerInput();