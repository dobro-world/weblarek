import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card";

export class PreviewCard extends Card {
    protected cardText: HTMLElement;
    protected basketAddButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(events, container);

        this.cardText = ensureElement<HTMLElement>('.card__text', this.container);
        this.basketAddButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this.basketAddButton.addEventListener('click', () => {
            this.events.emit('card:add');
        });
    }

    set text(value: string) {
        this.cardText.textContent = value;
    }
}