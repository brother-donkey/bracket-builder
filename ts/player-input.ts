import { useMockPlayers } from ".";
import { contentLoaded } from "./dom";

export interface SimplePlayer {
    name: string;
    seed: number;
}

export const inputPlayers = [] as SimplePlayer[];
export const playerInputForm = document.getElementById('player-input-form') as HTMLFormElement;
export const tournamentRoster = document.getElementById('player-input-added-players') as HTMLElement;

playerInputForm.addEventListener('submit', e => {
    e.preventDefault();
});

export async function handlePlayerInput() {
    await contentLoaded;

    playerInputForm.hidden = false;

    window.addEventListener('click', e => {
        const target = e.target as HTMLElement;
        if (!target.classList.contains('add-player')) {
            return;
        }

        const startButton = document.getElementById('start-tournament') as HTMLButtonElement;
        const playerField = target.parentElement.parentElement;
        const playerName = playerField.querySelector('input.name') as HTMLInputElement;
        const playerSeed = playerField.querySelector('input.seed') as HTMLInputElement;

        if (playerName.value !== '' && playerName.value !== undefined && playerName.value !== null) {
            const name = playerName.value;
            inputPlayers.push({
                name,
                seed: parseInt(playerSeed.value)
            });
            playerName.value = '';
            playerName.placeholder = `Next player's name`;
            playerSeed.value = '0';
        } else {
            playerName.value = '';
            playerName.placeholder = `Enter a name!`;
        }

        if (inputPlayers.length >= 6 || useMockPlayers) {
            startButton.disabled = false;
        }

        updateRoster(inputPlayers);

        const nameInput = document.querySelector('.input.name') as HTMLInputElement;
        if (nameInput) {
            nameInput.focus();
        }
    });
}


export function updateRoster(players: SimplePlayer[]) {

    const playerHTML = players.map(player => {
        const escapedName = player.name.split(' ').map(n => escape(n)).join(' ');
        return `
        <div class="player" data-player-name="player-1" data-player-by="false">
            <span class="seed is-higher" >${isNaN(player.seed) || player.seed === 0 ? "?" : player.seed}</span><span class="player-name">${escapedName}</span >
        </div>`;
    }).join('');

    tournamentRoster.innerHTML = `${playerHTML}`;
}

