export function getNumberOfRounds(numberOfPlayers: number): number {
    let counter = 1;
    let playersDivided = numberOfPlayers / 2;
    while (playersDivided >= 2) {
        counter++;
        playersDivided = playersDivided / 2;
    }
    debugger;
    return counter;
}

export function createRoundContainers(container: HTMLElement, numberOfRounds: number): HTMLElement[] {
    const rounds = [];
    for (let i = 0; i < numberOfRounds; i++) {
        const section = document.createElement('section');
        section.dataset.roundNumber = `${i + 1}`;
        section.classList.add('round');
        const sectionHeader = document.createElement('header');
        sectionHeader.classList.add('round-label');
        sectionHeader.textContent = `Round ${i + 1}`
        section.appendChild(sectionHeader);
        rounds.push(section);
        container.appendChild(section);
    }
    return rounds;
} 