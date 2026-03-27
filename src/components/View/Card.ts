import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";


interface ICard {
    title: string;
    price: string;
}

export class Card extends Component<ICard> {
    protected cardTitle: HTMLElement;
    protected cardPrice: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
        this.cardPrice = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set title(value: string) {
        this.cardTitle.textContent = String(value);
    }

    set price(value: string) {
        this.cardPrice.textContent = String(value);
    }
}