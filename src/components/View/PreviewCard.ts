import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { IEvents } from "../base/Events";

export class PreviewCard extends Card {
    protected cardText: HTMLElement;
    protected basketButton: HTMLButtonElement;
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.cardText = ensureElement<HTMLElement>('.card__text', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);

        this.basketButton.addEventListener('click', () => {
            this.events.emit('preview:button-clicked', { id: this.container.dataset.id });
        });
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set text(value: string) {
        this.cardText.textContent = value;
    }

    set buttonText(value: string) {
        this.basketButton.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this.basketButton.disabled = value;
    }

    set image(value: string) {
        this.setImage(this.imageElement, value, this.title);
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
    }
}