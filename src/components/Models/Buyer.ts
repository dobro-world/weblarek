import { IBuyer, IValidationResult } from "../../types";

export class Buyer {
    private data: IBuyer = {
      payment: '',
      email: '',
      phone: '',
      address: ''
    }

    setBuyerData(data: Partial<IBuyer>): void {
      this.data = {...this.data, ...data};
    }

    getBuyerData(): IBuyer {
        return {...this.data};
    }

    clearBuyerData(): void {
        this.data = {
            payment: '',
            email: '',
            phone: '',
            address: ''
        };
    }

    validateBuyerData(): IValidationResult {
        const errors: Partial<Record<keyof IBuyer, string>> = {};

        if (!this.data.payment) {
            errors.payment = 'Способ оплаты не выбран';
        }

        if (!this.data.email) {
            errors.email = 'Email не может быть пустым';
        }

        if (!this.data.phone) {
            errors.phone = 'Телефон не может быть пустым';
        }

        if (!this.data.address) {
            errors.address = 'Адрес не может быть пустым';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}