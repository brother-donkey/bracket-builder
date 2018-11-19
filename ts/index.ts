import { ITBAPlayer, IPlayer, IGame, IRecord, BracketItem } from "./types";
import { Game } from "./game";
import { Player, TBAPlayer } from "./player";
import { createBracket, addByes, createGame } from "./setup";
import { getNumberOfGames, getNumberOfRounds } from "./utilities";
import { renderGame, selectAllGameElements } from "./render";
import { playerInputForm, handlePlayerInput, inputPlayers } from './player-input';

// just make some players

window.addEventListener('StartTournament', () => {
    // const players = inputPlayers.map(({ name, seed }) => {
    //     return new Player(name, seed);
    // });

    const players = [];

    // create tourney structure
    const completeArr = addByes(players) as IPlayer[];
    const numberOfGames = getNumberOfGames(completeArr.length);
    let currentGameId = numberOfGames; // decrement as games are assigned their ids

    for (let i = 0; i < 62; i++) {
        players.push(new Player('player-' + i.toString(), i));
    }

    const baseBracket = createBracket(players);
    console.log({ baseBracket });
    const tourney = createGame(baseBracket, getNumberOfRounds(players.length)); // recursively creates all games

    console.log({ tourney });

    const tourneyElt = document.getElementById('tourney') as HTMLMainElement;
    renderGame(tourney, tourneyElt);
});

window.dispatchEvent(new CustomEvent('StartTournament'));

// console.log(selectAllGameElements());

// handlePlayerInput();