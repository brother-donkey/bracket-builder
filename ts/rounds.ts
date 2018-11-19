export function getNumberOfRounds(numberOfPlayers: number): number {
    let counter = 1;
    let playersDivided = numberOfPlayers / 2;
    while (playersDivided >= 2) {
        counter++;
        playersDivided = playersDivided / 2;
    }
    return counter;
}

export function createRoundContainers(container: HTMLElement, numberOfRounds: number): HTMLElement[] {
    const rounds = [];
    for (let i = 0; i < numberOfRounds; i++) {
        const section = document.createElement('section');
        section.dataset.roundNumber = `${i + 1}`;
        section.classList.add('round');
        rounds.push(section);
        container.appendChild(section);
    }
    return rounds;
} 