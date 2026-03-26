import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card";

export class PreviewCard extends Card {
    protected cardText: HTMLElement;
    protected basketAddButton: HTMLButtonElement;
    private _isInCart: boolean = false;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(events, container);

        this.cardText = ensureElement<HTMLElement>('.card__text', this.container);
        this.basketAddButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this.basketAddButton.addEventListener('click', (e) => {
            e.stopPropagation();
            // Здесь нужно эмитить правильное событие в зависимости от состояния
            if (this._isInCart) {
                this.events.emit('card:delete-from-preview');
            } else {
                this.events.emit('card:add');
            }
        });
    }

    set text(value: string) {
        this.cardText.textContent = value;
    }

    set isInCart(value: boolean) {
        this._isInCart = value;
        if (value) {
            this.basketAddButton.textContent = 'Удалить из корзины';
        } else {
            this.basketAddButton.textContent = 'В корзину';
        }
    }

    // Добавляем метод для обновления состояния кнопки извне
    updateButtonState(isInCart: boolean) {
        this._isInCart = isInCart;
        if (isInCart) {
            this.basketAddButton.textContent = 'Удалить из корзины';
        } else {
            this.basketAddButton.textContent = 'В корзину';
        }
    }

    set price(value: string) {
        super.price = value;
        if (value === '0 синапсов' || value === 'null синапсов') {
            this.basketAddButton.disabled = true;
            this.basketAddButton.textContent = 'Недоступно';
        } else {
            this.basketAddButton.disabled = false;
            // Восстанавливаем текст кнопки в зависимости от состояния
            if (this._isInCart) {
                this.basketAddButton.textContent = 'Удалить из корзины';
            } else {
                this.basketAddButton.textContent = 'В корзину';
            }
        }
    }
}