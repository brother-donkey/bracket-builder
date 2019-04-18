export function updateGamesLeftElement(gamesLeft?: number) {
	const elt = document.querySelector('.number-games-left') as HTMLElement;

	if (!gamesLeft) {
		let gamesCount;
		try {
			gamesCount = parseInt(elt.textContent);
		} catch (e) {
			return;
		}
		gamesCount--;
		gamesLeft = gamesCount;
	}

	elt.textContent = gamesLeft.toString();
	updateWord();

	function updateWord() {
		const elt = document.querySelector('.players-games-left');
		const singular = gamesLeft === 1;
		const label = singular ? 'Game Left' : 'Games Left';
		elt.textContent = ` ${label}`;
		return;
	}
}