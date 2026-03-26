// components/View/Card.ts
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { CDN_URL, categoryMap } from "../../utils/constants";

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
    protected cardImage?: HTMLImageElement;
    protected cardCategory?: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
        this.cardPrice = ensureElement<HTMLElement>('.card__price', this.container);
        this.cardImage = this.container.querySelector('.card__image') as HTMLImageElement;
        this.cardCategory = this.container.querySelector('.card__category') as HTMLElement;
    }

    set title(value: string) {
        this.cardTitle.textContent = String(value);
    }

    set price(value: string) {
        this.cardPrice.textContent = String(value);
    }

    set image(value: string) {
        if (this.cardImage && value) {
            const cleanPath = value.startsWith('/') ? value.slice(1) : value;
            this.cardImage.src = `${CDN_URL}/${cleanPath}`;
        }
    }

    set category(value: Category) {
        if (!this.cardCategory) return;
        this.cardCategory.textContent = value;

        Object.values(categoryMap).forEach(className => {
            this.cardCategory!.classList.remove(className);
        });

        this.cardCategory.classList.add(categoryMap[value]);
    }

    render(): HTMLElement {
        return this.container;
    }
}