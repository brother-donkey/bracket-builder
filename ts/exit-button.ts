export function setUpExitButtons() {

    window.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('exit')) {
            const parent = target.closest('.has-exit') as HTMLElement;
            if (parent) {
                e.preventDefault();
                parent.hidden = true;
            }
        }
    });
}