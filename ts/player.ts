import { IPlayer, IRecord, ITBAPlayer } from "./types";

export class TBAPlayer implements ITBAPlayer {
    name = "TBD";
    seed = null;
    record = null;
    isBye = false;
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
    }

    name: string;
    seed: number;
    record: IRecord;
    isBye: boolean;
};