export function removeStarOrSkull(container: HTMLElement): HTMLElement {
    const star = container.querySelector('.fa-star');
    const skull = container.querySelector('.fa-skull');

    if (star) {
        star.parentElement.removeChild(star);
    }

    if (skull) {
        skull.parentElement.removeChild(skull);
    }

    return container;
}

export function resetRecordOnRedeclaredGame(previousWinner: IPlayer, player1: IPlayer, player2: IPlayer, winnerChanged: boolean, previousWinningScore: number, previousLosingScore: number): void {
    let winner = previousWinner.name === player1.name ? player1 : player2;
    let loser = previousWinner.name === player1.name ? player2 : player1;

    const differential = previousWinningScore - previousLosingScore;

    if (winnerChanged) {
        // switch the reference if the winner changed is passed in
        winner = previousWinner.name === player1.name ? player2 : player1;
        loser = previousWinner.name === player1.name ? player1 : player2;

        winner.record.losses--;
        loser.record.wins--;
        winner.record.pointDifferential += differential;
        loser.record.pointDifferential -= differential;

        const wI = winner.record.playersLostTo.findIndex(p => p === loser.name);
        winner.record.playersLostTo.splice(wI, 1);

        const lI = loser.record.playersBeaten.findIndex(p => p === winner.name);
        loser.record.playersBeaten.splice(lI, 1);
        return;
    }

    winner.record.pointDifferential -= differential;
    loser.record.pointDifferential += differential;

    return;
}