import { contentLoaded } from "./dom";
import { setUpFocusTracker, setUpGameFinishModalEvent, setupStartTournamentButtonClick, setupWinnerDeclaredEvent, setUpWinnerDeclaredEventListener } from "./events";
import { setUpExitButtons } from "./exit-button";
import { mockFamily } from "./mocks";
import { Player } from "./player";
import { handlePlayerInput, SimplePlayer } from './player-input';
import { createRoundContainers, getNumberOfRounds } from "./rounds";
import { addByes, assignParentGames, createBracket, createGame, flattenGames, renderGamesInRoundContainers } from "./setup";
import { IGame, IPlayer } from "./types";

export const players = [];
export const useMockPlayers: boolean = true;
export const mockPlayers = mockFamily;

window.addEventListener('StartTournament', startTournament);

setUpExitButtons();
handleMockData();
handlePlayerInput();
setupStartTournamentButtonClick();

export function convertSimplePlayersToFull(simplePlayers: SimplePlayer[]): IPlayer[] {
    return simplePlayers.map(player => new Player(player.name, player.seed));
}

export async function startTournament(e: CustomEvent) {
    await contentLoaded;

    // get Players from event
    const playersWithoutByes = useMockPlayers ? mockPlayers : e.detail as SimplePlayer[];

    // create tourney structure - later refactor into init initBracket function player[] => IGame tournament
    const { numberOfRounds, tourney } = createTournamentStructure(playersWithoutByes); // recursively creates all games

    const tourneyElt = document.getElementById('tourney') as HTMLMainElement;

    createRoundContainers(tourneyElt, numberOfRounds);

    const withParents = assignParentGames(tourney);
    const games = flattenGames(withParents, []);
    renderGamesInRoundContainers(games, tourneyElt);
    setUpGameFinishModalEvent(games);
    setupWinnerDeclaredEvent(games);
    setUpWinnerDeclaredEventListener(games);
    setUpFocusTracker();
}

function createTournamentStructure(playersWithoutByes: SimplePlayer[]): { numberOfRounds: number; tourney: IGame } {
    const playersWithBys = addByes(playersWithoutByes);
    const players = convertSimplePlayersToFull(playersWithBys);
    const numberOfRounds = getNumberOfRounds(players.length);
    const baseBracket = createBracket(players);
    const tourney = createGame(baseBracket, numberOfRounds); // recursively creates all games
    return { numberOfRounds, tourney };
}

function handleMockData() {
    if (!useMockPlayers) {
        return;
    }
    const startButton = document.getElementById('start-tournament') as HTMLButtonElement;
    startButton.disabled = false;
}