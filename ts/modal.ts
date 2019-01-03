import { contentLoaded } from "./dom";

export interface IModalConfig {
    title: string;
    explanation: string;
    footerHTML: string;
}

export const redeclarationModalConfig = {
    title: 'Careful!',
    explanation: `Are you sure you want to change the outcome of this game? If the winner has changed, you'll have to redo the results for games in this branch of the tournament.`,
    footerHTML: `
        <button class="cancel exit">
            <span>Cancel</span>
            <i class="fas fa-thumbs-down"></i>
        </button>
        <button class="confirm exit">
            <span>Confirm</span>
            <i class="fas fa-thumbs-up"></i>
        </button>`
}

export async function populateModalContent(modalConfig: IModalConfig): Promise<HTMLElement> {
    await contentLoaded;

    const modal = document.querySelector('.modal') as HTMLElement;
    if (!modal) {
        return;
    }

    const title = modal.querySelector('.title');
    if (title) {
        title.textContent = modalConfig.title;
    }

    const explanation = modal.querySelector('.explanation');
    if (explanation) {
        explanation.textContent = modalConfig.explanation;
    }

    const footer = modal.querySelector('.footer');
    if (footer) {
        footer.innerHTML = modalConfig.footerHTML;
    }

    return modal;
}

export function showModal(modal: HTMLElement): void {
    modal.hidden = false;
}

export function hideModal(modal: HTMLElement): void {
    modal.hidden = true;
}

export async function setUpModalEvents() {
    await contentLoaded;
    window.addEventListener('click', handleModalExit);

    function handleModalExit(e: Event) {
        const target = e.target as HTMLElement;
        if (target.classList.contains('exit')) {
            // debugger;
            const modal = target.closest('.exit-parent') as HTMLElement;
            if (!modal) {
                return;
            }
            modal.hidden = true;
        }
    }
}

export function awaitModalConfirmation(modal: HTMLElement, callback: Function) {
    modal.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('confirm')) {
            callback();
        }
        return;
    })
}