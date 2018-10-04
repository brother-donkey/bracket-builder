interface SimplePlayer {
    name: string;
    seed: number;
}

export const inputPlayers = [] as SimplePlayer[];
export const playerInputForm = document.getElementById('player-input-form') as HTMLFormElement;
export const tournamentRoster = document.getElementById('tournament-roster') as HTMLElement;

playerInputForm.addEventListener('submit', e => {
    e.preventDefault();
    console.log(e.target.value);
})
// add event listener to the add button - ev dele

export function handlePlayerInput() {
    playerInputForm.insertAdjacentHTML('afterbegin', buildNewPlayerInput(1));

    window.addEventListener('click', e => {
        const target = e.target as HTMLElement;
        if (!target.classList.contains('add-player')) {
            return;
        }

        const playerField = target.parentElement.parentElement;
        const playerName = playerField.querySelector('input.name') as HTMLInputElement;
        const playerSeed = playerField.querySelector('input.seed') as HTMLInputElement;
        // console.log(playerField, playerName, playerSeed);
        if (playerName.value !== '' && playerName.value !== undefined && playerName.value !== null) {
            inputPlayers.push({
                name: playerName.value,
                seed: parseInt(playerSeed.value)
            });
            playerName.value = '';
            playerName.placeholder = `Next player's name`;
            playerSeed.value = '0';
        } else {
            console.log('fuck');
            playerName.value = '';
            playerName.placeholder = `Enter a name!`;
        }


        console.log(inputPlayers)
        updateRoster(inputPlayers);
    });

}

export function buildNewPlayerInput(playerId: number) {
    return `
    <fieldset class="form-player-container">
        <div class="form-player-input-container">
            <input class="input name" type="text" name="size" placeholder="Name">
        </div>
        <div class="form-seed-container">
            <input class="input seed" type="text" placeholder="Seed" name="size" value="0">
        </div>
        <div class="form-add-player-container">
            <button class="button add-player" type="button">Add</button>
        </div>
    </fieldset>
    `;
}

export function updateRoster(players: SimplePlayer[]) {

    const playerHTML = players.map(player => {
        return `<p class="roster-player name">${player.name}</p><p class="roster-player seed">${player.seed}</p>`;
    }).join('');

    tournamentRoster.innerHTML = `<div class="roster-label"> Player</div><div class="roster-label">Seed </div>${playerHTML}`
}