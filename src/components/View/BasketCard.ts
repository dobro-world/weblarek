import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card";

export class BasketCard extends Card {
    protected cardIndex: HTMLElement;
    protected basketButtonDelete: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.cardIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.basketButtonDelete = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.basketButtonDelete.addEventListener('click', () => {
            this.events.emit('basket:delete-item', { id: this.container.dataset.id });
        });
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set index(value: number) {
        this.cardIndex.textContent = String(value);
    }
}