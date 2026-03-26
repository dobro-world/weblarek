import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { BaseForm } from "./BaseForm";
import { TPayment } from "../../types";

export class OrderForm extends BaseForm {
    protected addressInput: HTMLInputElement;
    protected paymentButtons: HTMLButtonElement[];
    protected submitButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(events, container);

        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this.paymentButtons = Array.from(this.container.querySelectorAll('.button_alt'));
        this.submitButton = ensureElement<HTMLButtonElement>('.order__button', this.container);

        this.setSubmitButtonState(false);
        this.initEventListeners();
    }

    private initEventListeners(): void {
        this.addressInput.addEventListener('input', () => {
            this.events.emit('order:change', { 
                value: this.addressInput.value 
            });
            this.validateForm();
        });

        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const paymentValue = button.name as TPayment;
                this.events.emit('order:payment', { 
                    value: paymentValue 
                });
                this.setActivePaymentButton(button.name);
                this.validateForm();
            });
        });

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.isFormValid()) {
                this.events.emit('order:next');
            }
        });
    }

    private setActivePaymentButton(paymentMethod: string): void {
        this.paymentButtons.forEach(button => {
            const isActive = button.name === paymentMethod;
            button.classList.toggle('button_alt-active', isActive);
        });
    }

    private isFormValid(): boolean {
        const hasAddress = this.addressInput.value.trim().length > 0;
        const hasPayment = this.paymentButtons.some(button => 
            button.classList.contains('button_alt-active')
        );
        return hasAddress && hasPayment;
    }

    private setSubmitButtonState(isValid: boolean): void {
        this.submitButton.disabled = !isValid;
    }

    private validateForm(): void {
        const hasAddress = this.addressInput.value.trim().length > 0;
        const hasPayment = this.paymentButtons.some(button => 
            button.classList.contains('button_alt-active')
        );
        const isValid = hasAddress && hasPayment;
        
        this.setSubmitButtonState(isValid);
        
        if (!hasAddress && this.addressInput.value.trim().length === 0) {
            this.showError('Введите адрес доставки');
        } else if (!hasPayment) {
            this.showError('Выберите способ оплаты');
        } else {
            this.clearError();
        }
    }

    set address(value: string) {
        this.addressInput.value = value;
        this.validateForm();
    }

    set payment(value: TPayment) {
        if (value) {
            this.setActivePaymentButton(value);
            this.validateForm();
        }
    }

    render(): HTMLElement {
        this.resetForm();
        return this.container;
    }

    private resetForm(): void {
        this.addressInput.value = '';
        this.paymentButtons.forEach(button => {
            button.classList.remove('button_alt-active');
        });
        this.setSubmitButtonState(false);
        this.clearError();
    }
}