import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card";

export class BasketCard extends Card {
    protected cardIndex: HTMLElement;
    protected basketButtonDelete: HTMLButtonElement;
    private _product!: IProduct;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(events, container);

        this.cardIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.basketButtonDelete = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.basketButtonDelete.addEventListener('click', () => {
            if (this._product) {
                this.events.emit('card:delete', this._product);
            }
        });
    }

    set product(product: IProduct) {
        this._product = product;
    }

    set index(value: number) {
        if (this.cardIndex) this.cardIndex.textContent = String(value);
    }

    set title(value: string) {
        const el = this.container.querySelector('.card__title');
        if (el) el.textContent = value;
    }

    set price(value: string) {
        const el = this.container.querySelector('.card__price');
        if (el) el.textContent = value;
    }
}