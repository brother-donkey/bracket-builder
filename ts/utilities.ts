
export function getNumberOfGames(num: number): number {
    let numberOfGames = 0;
    num /= 2;
    while (num > 1) {
        numberOfGames += num;
        num /= 2;
    }
    return numberOfGames;
}

export function constrainFocusToContainer(selector: string) {
    window.addEventListener('focus', (e) => { console.log(e) });
    window.addEventListener('focus', (e) => {
        console.log(e.target);
    });
}

export function constrainFocus(selector: string): (this: Window, ev: FocusEvent) => any {
    return (e: Event) => {
        // console.log(e);
        const target = e.target as HTMLElement;
        if (target instanceof HTMLElement && target.closest(selector)) {
            console.log('n')
            return;
        }
        // console.log('o');
        const container = document.querySelector(selector);
        const firstFocusable = Array.from(container.querySelectorAll(`a[href]:not([tabindex='-1']),
          area[href]:not([tabindex='-1']),
          input:not([disabled]):not([tabindex='-1']),
          select:not([disabled]):not([tabindex='-1']),
          textarea:not([disabled]):not([tabindex='-1']),
          button:not([disabled]):not([tabindex='-1']),
          iframe:not([tabindex='-1']),
          [tabindex]:not([tabindex='-1']),
          [contentEditable=true]:not([tabindex='-1'])`)) as HTMLElement[];
        firstFocusable[0].focus(); // note this is wrong because tabbing up will only ever get to exit, not the end of the world but still wrong
    };
}
