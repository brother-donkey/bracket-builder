import { IPlayer, IRecord, ITBAPlayer } from "./types";

export class TBAPlayer implements ITBAPlayer {
    name = "TBD";
    seed = null;
    record = null;
    isBye = false;
    id = `${getRandomInt(100000)}TBA`;
}

const byeRegex = /^Bye/;

export class Player implements IPlayer {

    constructor(name: string, seed?: number) {
        this.name = name;
        this.seed = seed || 0;
        this.record = {
            wins: 0,
            losses: 0,
            pointDifferential: 0,
            playersLostTo: [],
            playersBeaten: []
        };
        this.isBye = byeRegex.test(name);
        this.id = `${getRandomInt(1000000)}${this.name}`;
    }

    name: string;
    seed: number;
    record: IRecord;
    isBye: boolean;
    id: string;
};

export function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}
