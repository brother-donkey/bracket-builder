export function setUpGameFinishedEvent() {
    window.addEventListener('click', e => {
        const target = e.target as HTMLElement;
        const game = target.closest('.game');
        if (game && game.classList.contains('ready')) {
            console.log(game);
        }
    });
}