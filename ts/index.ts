import { ITBAPlayer, IPlayer, IGame, IRecord, BracketItem } from "./types";
import { Game } from "./game";
import { Player, TBAPlayer } from "./player";
import { createBracket, addByes, createGame, flattenGames, sortByRound, assignParentGames } from "./setup";
import { getNumberOfGames } from "./utilities";
import { renderGame } from "./render";
import { playerInputForm, handlePlayerInput, inputPlayers } from './player-input';
import { createPlayers } from "./mock-players";
import { createRoundContainers, getNumberOfRounds } from "./rounds";

// just make some players
export const allGames = [];

window.addEventListener('StartTournament', () => {
    // const players = inputPlayers.map(({ name, seed }) => {
    //     return new Player(name, seed);
    // });

    const players = createPlayers(32);

    // create tourney structure
    // const numberOfGames = getNumberOfGames(players.length);
    // let currentGameId = numberOfGames; // decrement as games are assigned their ids
    const numberOfRounds = getNumberOfRounds(players.length);
    const baseBracket = createBracket(players);
    const tourney = createGame(baseBracket, numberOfRounds); // recursively creates all games

    const tourneyElt = document.getElementById('tourney') as HTMLMainElement;

    createRoundContainers(tourneyElt, numberOfRounds);

    renderGame(tourney, tourneyElt);
    const flat = [];
    const withParents = assignParentGames(tourney);
    console.log(flattenGames(withParents, flat));
    // console.log(sortByRound(flat));
});

window.dispatchEvent(new CustomEvent('StartTournament'));

// handlePlayerInput();