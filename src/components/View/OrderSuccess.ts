// components/View/OrderSuccess.ts
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export class OrderSuccess {
    protected closeButton: HTMLButtonElement;
    protected descriptionElement: HTMLElement;

    constructor(protected events: IEvents, protected container: HTMLElement) {
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
        
        this.closeButton.addEventListener('click', () => {
            this.events.emit('modal:close');
        });
    }

    set total(value: number) {
        this.descriptionElement.textContent = `Списано ${value} синапсов`;
    }

    render(): HTMLElement {
        return this.container;
    }
}