import { ITBAPlayer, IPlayer, IGame, IRecord, BracketItem } from "./types";
import { Game } from "./game";
import { Player, TBAPlayer } from "./player";
import { createBracket, addByes, createGame, flattenGames, sortByRound, assignParentGames, renderGamesInRoundContainers } from "./setup";
import { getNumberOfGames } from "./utilities";
import { renderGame } from "./render";
import { playerInputForm, handlePlayerInput, inputPlayers } from './player-input';
import { createFakePlayers } from "./mock-players";
import { createRoundContainers, getNumberOfRounds } from "./rounds";
import { setUpGameFinishModalEvent, setupWinnerDeclaredEvent, setUpWinnerDeclaredEventListener, setUpFocusTracker, setupStartTournamentButtonClick } from "./events";
import { setUpExitButtons } from "./exit-button";

export const players = [];

window.addEventListener('StartTournament', (e: CustomEvent) => {

    // get Players from event
    const realPlayers = e.detail as IPlayer[];

    // const mockPlayers = createFakePlayers(30);

    // create tourney structure - later refactor into init initBracket function player[] => IGame tournament
    const players = addByes(realPlayers);
    const numberOfRounds = getNumberOfRounds(players.length);
    const baseBracket = createBracket(players);
    const tourney = createGame(baseBracket, numberOfRounds); // recursively creates all games
    const tourneyElt = document.getElementById('tourney') as HTMLMainElement;

    createRoundContainers(tourneyElt, numberOfRounds);

    const flat = [];
    const withParents = assignParentGames(tourney);
    const games = flattenGames(withParents, flat);
    renderGamesInRoundContainers(games, tourneyElt);
    setUpGameFinishModalEvent(games);
    setupWinnerDeclaredEvent(games);
    setUpWinnerDeclaredEventListener(games);
    setUpFocusTracker();
});

setUpExitButtons();

handlePlayerInput();
setupStartTournamentButtonClick();