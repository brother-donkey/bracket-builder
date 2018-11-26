import { Player } from "./player";
import { IPlayer } from "./types";

export function createFakePlayers(numberOfPlayers: number): IPlayer[] {
    const players = [];
    for (let i = 0; i < numberOfPlayers; i++) {
        players.push(new Player(`player-${i + 1}`, i + 1));
    }
    return players;
}
