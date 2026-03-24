import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { categoryMap } from "../../utils/constants";

type Category = keyof typeof categoryMap;

interface ICard {
    title: string;
    price: string;
    image: string;
    category: Category;
}

export class Card extends Component<ICard> {
    protected cardTitle: HTMLElement;
    protected cardPrice: HTMLElement;
    protected cardImage: HTMLImageElement;
    protected cardCategory: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
        this.cardPrice = ensureElement<HTMLElement>('.card__price', this.container);
        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
    }

    set title(value: string) {
        this.cardTitle.textContent = String(value);
    }

    set price(value: string) {
        this.cardPrice.textContent = String(value);
    }

    set image(value: string) {
        this.cardImage.src = String(value);
    }

    set category(value: Category) {
        this.cardCategory.textContent = String(value);

        Object.values(categoryMap).forEach(className => {
            this.cardCategory.classList.remove(className);
        })

        const newClass = categoryMap[value];
        this.cardCategory.classList.add(newClass);
    }

    render(): HTMLElement {
        return this.container;
    }
}