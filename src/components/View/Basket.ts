import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
    value: number;
}

export class Basket extends Component<IBasket> {
    protected basketList: HTMLElement;
    protected basketTotalPrice: HTMLElement;
    protected basketButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.basketTotalPrice = ensureElement<HTMLElement>('.basket__price', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.basketButton.addEventListener('click', () => {
            this.events.emit('order:start');
        });
    }

    set listItems(items: HTMLElement[]) {
        this.basketList.replaceChildren(...items);
    }

    set totalPrice(value: number) {
        this.basketTotalPrice.textContent = `${value} синапсов`;
    }

    set buttonDisabled(value: boolean) {
        this.basketButton.disabled = value;
    }
}