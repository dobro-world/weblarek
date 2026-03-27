import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { BaseForm } from "./BaseForm";
import { TPayment } from "../../types";

export class OrderForm extends BaseForm {
    protected addressInput: HTMLInputElement;
    protected paymentButtons: HTMLButtonElement[];

    constructor(protected events: IEvents, container: HTMLElement) {
        super(events, container);

        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this.paymentButtons = Array.from(this.container.querySelectorAll('.button_alt'));

        this.addressInput.addEventListener('input', () => {
            this.events.emit('order:address:changed', { 
                value: this.addressInput.value 
            });
        });

        this.paymentButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();

                const paymentValue = button.name as TPayment;

                this.events.emit('order:payment:changed', { 
                value: paymentValue 
                });
            });
        });
    }

    set address(value: string) {
        this.addressInput.value = value;
    }

    set payment(value: TPayment) {
        this.paymentButtons.forEach(button => {
            const isActive = button.name === value;
            button.classList.toggle('button_alt-active', isActive);
        });
    }
}