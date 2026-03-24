import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card";

export class BasketCard extends Card {
    protected cardIndex: HTMLElement;
    protected basketButtonDelete: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(events, container);

        this.cardIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.basketButtonDelete = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.basketButtonDelete.addEventListener('click', () => {
            this.events.emit('card:delete');
        });
    }

    set index(value: number) {
        this.cardIndex.textContent = String(value);
    }
}