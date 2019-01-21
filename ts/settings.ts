export function setupSettingsToggle(): void {
    const settingsButton = document.getElementById('settings-button') as HTMLElement;
    if (settingsButton) {
        settingsButton.hidden = false;
    }

    window.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement;
        if (target && (target.id === 'settings-button' || target.closest('#settings-button'))) {
            const settings = document.getElementById('settings') as HTMLElement;
            if (settings) {
                if (settings.classList.contains('is-active')) {
                    settings.classList.remove('is-active');
                    settings.setAttribute('aria-hidden', 'true');
                } else {
                    settings.classList.add('is-active');
                    settings.removeAttribute('aria-hidden');
                }
            }
        }
    });
}