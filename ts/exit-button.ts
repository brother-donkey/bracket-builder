export function setUpExitButtons() {

    window.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const parent = target.closest('.has-exit') as HTMLElement;
        console.log({ target }, { parent })
        if (parent) {
            e.preventDefault();
            parent.hidden = true;
        }
    });
}