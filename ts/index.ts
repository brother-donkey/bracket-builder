import { ITBAPlayer, IPlayer, IGame, IRecord, BracketItem } from "./types";
import { Game } from "./game";
import { Player, TBAPlayer } from "./player";
import { createBracket, addByes, createGame, flattenGames, sortByRound, assignParentGames, renderGamesInRoundContainers } from "./setup";
import { getNumberOfGames } from "./utilities";
import { renderGame } from "./render";
import { playerInputForm, handlePlayerInput, inputPlayers } from './player-input';
import { createPlayers } from "./mock-players";
import { createRoundContainers, getNumberOfRounds } from "./rounds";
import { setUpGameFinishedEvent, setupWinnerDeclaredEvent } from "./events";
import { setUpExitButtons } from "./exit-button";
import { setUpFinshGameButtons } from "./finish-game";

window.addEventListener('StartTournament', () => {
    // const players = inputPlayers.map(({ name, seed }) => {
    //     return new Player(name, seed);
    // });

    // create some fake players

    const mockPlayers = createPlayers(30);

    // create tourney structure - later refactor into init initBracket function player[] => IGame tournament
    const players = addByes(mockPlayers);
    const numberOfRounds = getNumberOfRounds(players.length);
    const baseBracket = createBracket(players);
    const tourney = createGame(baseBracket, numberOfRounds); // recursively creates all games
    const tourneyElt = document.getElementById('tourney') as HTMLMainElement;

    createRoundContainers(tourneyElt, numberOfRounds);

    // renderGame(tourney, tourneyElt);
    const flat = [];
    const withParents = assignParentGames(tourney);
    const games = flattenGames(withParents, flat);
    renderGamesInRoundContainers(games, tourneyElt);
    setUpGameFinishedEvent(games);
    setupWinnerDeclaredEvent(games);
});

window.dispatchEvent(new CustomEvent('StartTournament'));

setUpExitButtons();

// handlePlayerInput();
