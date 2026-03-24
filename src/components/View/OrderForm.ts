import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { BaseForm } from "./BaseForm";

export class OrderForm extends BaseForm {
    protected addressInput: HTMLInputElement;
    protected paymentButtons: HTMLButtonElement[];

    constructor(protected events: IEvents, container: HTMLElement) {
        super(events, container);

        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this.paymentButtons = Array.from(this.container.querySelectorAll('.button_alt'));

        this.addressInput.addEventListener('input', () => {
            this.events.emit('order:change', {
                field: 'address',
                value: this.addressInput.value
            });
        });

        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.events.emit('order:payment', {
                    value: button.name
                });
            });
        });
    }

    set address(value: string) {
        this.addressInput.value = value;
    }

    set payment(value: string) {
        this.paymentButtons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === value);
        });
    }
}