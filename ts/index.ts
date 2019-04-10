import { contentLoaded } from "./dom";
import { setUpFocusTracker, setUpGameFinishModalEvent, setupStartTournamentButtonClick, setUpWinnerDeclaredEventListener, setupWinnerDeclaredInModalEvent } from "./events";
import { setUpGameRedeclarationEvent } from "./events/game-redeclaration";
import { setUpTheTournamentIsOverLosers, setupTournamentFinishedEvent } from "./events/tournament-finished";
import { setUpExitButtons } from "./exit-button";
import { mockFamily } from "./mocks";
import { setUpModalEvents } from "./modal";
import { Player } from "./player";
import { handlePlayerInput, SimplePlayer } from './player-input';
import { createRoundContainers, getNumberOfRounds } from "./rounds";
import { setupSettingsToggle } from "./settings";
import { addByes, assignParentGames, createBracket, createGame, flattenGames, renderGamesInRoundContainers } from "./setup";
import { IGame, IPlayer } from "./types";

export const players = [];
export const useMockPlayers: boolean = false;
export const mockPlayers = mockFamily;

window.addEventListener('StartTournament', startTournament);

setUpExitButtons();
handleMockData();
handlePlayerInput();
setupStartTournamentButtonClick();
setUpModalEvents();

export let currentPlayers = [];

export function convertSimplePlayersToFull(simplePlayers: SimplePlayer[]): IPlayer[] {
    return simplePlayers.map(player => new Player(player.name, player.seed));
}

export async function startTournament(e: CustomEvent) {
    await contentLoaded;

    // get Players from event
    const playersWithoutByes = useMockPlayers ? mockPlayers : e.detail as SimplePlayer[];

    // create tourney structure - later refactor into init initBracket function player[] => IGame tournament
    const { numberOfRounds, tourney, players } = createTournamentStructure(playersWithoutByes); // recursively creates all games
    currentPlayers = players || [];

    const tourneyElt = document.getElementById('tourney') as HTMLMainElement;

    createRoundContainers(tourneyElt, numberOfRounds);

    const withParents = assignParentGames(tourney);
    const flattenedGames = flattenGames(withParents, []);
    const games = markByesAsFinished(flattenedGames);
    renderGamesInRoundContainers(games, tourneyElt);

    // Event setup
    setUpGameFinishModalEvent(games);
    setupWinnerDeclaredInModalEvent(games);
    setUpWinnerDeclaredEventListener(games);
    setUpGameRedeclarationEvent();
    setupTournamentFinishedEvent();
    setUpFocusTracker();
    setupSettingsToggle();
    setUpTheTournamentIsOverLosers();
}

function createTournamentStructure(playersWithoutByes: SimplePlayer[]): { numberOfRounds: number; tourney: IGame; players: IPlayer[] } {
    const playersWithBys = addByes(playersWithoutByes);
    const players = convertSimplePlayersToFull(playersWithBys);
    const numberOfRounds = getNumberOfRounds(players.length);
    const baseBracket = createBracket(players);
    const tourney = createGame(baseBracket, numberOfRounds); // recursively creates all games
    return { numberOfRounds, tourney, players };
}

function handleMockData() {
    if (!useMockPlayers) {
        return;
    }
    const startButton = document.getElementById('start-tournament') as HTMLButtonElement;
    startButton.disabled = false;
}

function markByesAsFinished(games: IGame[]): IGame[] {
    games.forEach(game => {
        const { player1, player2 } = game;
        if (game.hasBye) {
            if (player1.isBye) {
                game.declareWinner(player2, [0, 0]);
            }

            if (player2.isBye) {
                game.declareWinner(player1, [0, 0]);
            }
        }
    });
    return games;
}