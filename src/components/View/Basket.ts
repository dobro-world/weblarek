// components/View/Basket.ts
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
    value: number;
}

export class Basket extends Component<IBasket> {
    basketList: HTMLElement;
    basketTotalPrice: HTMLElement;
    basketButton: HTMLButtonElement;
    protected emptyMessage: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.basketTotalPrice = ensureElement<HTMLElement>('.basket__price', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.emptyMessage = document.createElement('p');
        this.emptyMessage.textContent = 'Корзина пуста';
        this.emptyMessage.classList.add('basket__empty');

        this.basketButton.addEventListener('click', () => {
            this.events.emit('order:start');
        });
    }

    set listItems(items: HTMLElement[]) {
        if (items.length === 0) {
            this.basketList.replaceChildren(this.emptyMessage);
            this.basketButton.disabled = true;
        } else {
            this.basketList.replaceChildren(...items);
            this.basketButton.disabled = false;
        }
    }

    set totalPrice(value: number) {
        this.basketTotalPrice.textContent = `${value} синапсов`;
    }
}