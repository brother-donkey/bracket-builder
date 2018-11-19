export function getNumberOfGames(num: number): number {
    let numberOfGames = 0;
    num /= 2;
    while (num > 1) {
        numberOfGames += num;
        num /= 2;
    }
    return numberOfGames;
}

export function getNumberOfRounds(numberOfPlayers: number): number {
    let counter = 1;
    let playersDivided = numberOfPlayers / 2;
    while (playersDivided >= 2) {
        counter++;
        playersDivided = playersDivided / 2;
    }
    return counter;
}