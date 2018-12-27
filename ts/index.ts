import { setUpFocusTracker, setUpGameFinishModalEvent, setupStartTournamentButtonClick, setupWinnerDeclaredEvent, setUpWinnerDeclaredEventListener } from "./events";
import { setUpExitButtons } from "./exit-button";
import { mockFamily } from "./mocks";
import { Player } from "./player";
import { handlePlayerInput, SimplePlayer } from './player-input';
import { createRoundContainers, getNumberOfRounds } from "./rounds";
import { addByes, assignParentGames, createBracket, createGame, flattenGames, renderGamesInRoundContainers } from "./setup";
import { IPlayer } from "./types";

export const players = [];
export const useMockPlayers: boolean = true;
export const mockPlayers = mockFamily;

window.addEventListener('StartTournament', (e: CustomEvent) => {

    // get Players from event
    const playersWithoutByes = useMockPlayers ? mockPlayers : e.detail as SimplePlayer[];

    // const mockPlayers = createFakePlayers(30);

    // create tourney structure - later refactor into init initBracket function player[] => IGame tournament
    const playersWithBys = addByes(playersWithoutByes);
    const players = convertSimplePlayersToFull(playersWithBys);
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

export function convertSimplePlayersToFull(simplePlayers: SimplePlayer[]): IPlayer[] {
    return simplePlayers.map(player => new Player(player.name, player.seed));
}