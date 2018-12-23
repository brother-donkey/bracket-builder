import { SimplePlayer } from "./player-input";

type IMockPlayers = SimplePlayer[];

export const players64: IMockPlayers = generateRandomPlayers(64);
export const plarers32: IMockPlayers = generateRandomPlayers(32);
export const players16: IMockPlayers = generateRandomPlayers(16);
export const plarers8: IMockPlayers = generateRandomPlayers(8);

function generateRandomCharacters(length: number): string {
	return [...Array(length)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
}

function generateRandomPlayers(numberOfPlayers: number): IMockPlayers {
	const randomPlayers = [];
	for (let i = 0; i < numberOfPlayers; i++) {
		const name = generateRandomCharacters(7);
		const seed = i;

		randomPlayers.push({
			name,
			seed
		});
	}
	return randomPlayers;
}