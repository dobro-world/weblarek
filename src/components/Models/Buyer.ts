import { IBuyer, IValidationResult , TPayment } from "../../types";

export class Buyer implements IBuyer{
    payment: TPayment = '';
    email: string = '';
    phone: string = '';
    address: string = '';

    setBuyerData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.address !== undefined) this.address = data.address;
    }

    getBuyerData(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address
        }
    }

    clearBuyerData(): void {
        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';
    }

    validateBuyerData() : IValidationResult {
        const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this.payment) {
      errors.payment = 'Способ оплаты не выбран';
    }

    if (!this.email) {
      errors.email = 'Email не может быть пустым';
    } else if (!this.isValidEmail(this.email)) {
      errors.email = 'Некорректный формат email';
    }

    if (!this.phone) {
      errors.phone = 'Телефон не может быть пустым';
    } else if (!this.isValidPhone(this.phone)) {
      errors.phone = 'Некорректный формат телефона';
    }

    if (!this.address) {
      errors.address = 'Адрес не может быть пустым';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
    }

    private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }
}