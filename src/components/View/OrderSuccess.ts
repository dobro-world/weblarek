import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IOrderSuccess {
    total: number;
}

export class OrderSuccess extends Component<IOrderSuccess> {
    protected orderTotalPrice: HTMLElement;
    protected buttonNextPurchase: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.orderTotalPrice = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.buttonNextPurchase = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this.buttonNextPurchase.addEventListener('click', () => {
            this.events.emit('order:success:close');
        });
    }

    set total(value: number) {
        this.orderTotalPrice.textContent = `Списано ${value} синапсов`;
    }
}