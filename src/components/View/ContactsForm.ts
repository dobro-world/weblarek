import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { BaseForm } from "./BaseForm";

export class ContactsForm extends BaseForm {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    protected submitButton: HTMLButtonElement;
    protected formElement: HTMLFormElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(events, container);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
        this.submitButton = ensureElement<HTMLButtonElement>('.button', this.container);
        this.formElement = this.container as HTMLFormElement;

        this.submitButton.disabled = true;

        this.emailInput.addEventListener('input', () => {
            this.events.emit('contacts:change', { 
                field: 'email', 
                value: this.emailInput.value 
            });
            this.updateButtonState();
        });

        this.phoneInput.addEventListener('input', () => {
            this.events.emit('contacts:change', { 
                field: 'phone', 
                value: this.phoneInput.value 
            });
            this.updateButtonState();
        });

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            const emailFilled = this.emailInput.value.trim() !== '';
            const phoneFilled = this.phoneInput.value.trim() !== '';
            
            if (emailFilled && phoneFilled) {
                this.events.emit('contacts:submit');
            }
        });

        if (this.formElement) {
            this.formElement.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const emailFilled = this.emailInput.value.trim() !== '';
                const phoneFilled = this.phoneInput.value.trim() !== '';
                
                if (emailFilled && phoneFilled) {
                    this.events.emit('contacts:submit');
                }
            });
        }
    }

    private updateButtonState(): void {
        const emailFilled = this.emailInput.value.trim() !== '';
        const phoneFilled = this.phoneInput.value.trim() !== '';
        const isValid = emailFilled && phoneFilled;
        
        this.submitButton.disabled = !isValid;
        
        if (!emailFilled && this.emailInput.value.trim().length === 0) {
            this.showError('Введите email');
        } else if (!phoneFilled) {
            this.showError('Введите номер телефона');
        } else {
            this.clearError();
        }
    }

    set email(value: string) {
        this.emailInput.value = value;
        this.updateButtonState();
    }

    set phone(value: string) {
        this.phoneInput.value = value;
        this.updateButtonState();
    }

    render(): HTMLElement {
        return this.container;
    }
}