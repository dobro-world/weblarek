import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { BaseForm } from "./BaseForm";

export class ContactsForm extends BaseForm {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(events, container);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this.emailInput.addEventListener('input', () => {
            this.events.emit('contacts:email:changed', { 
                value: this.emailInput.value 
            });
        });

        this.phoneInput.addEventListener('input', () => {
            this.events.emit('contacts:phone:changed', { 
                value: this.phoneInput.value 
            });
        });
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }
}