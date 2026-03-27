import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { categoryMap } from "../../utils/constants";
import { IEvents } from "../base/Events";

type CategoryKey = keyof typeof categoryMap;

export class CatalogCard extends Card {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

        this.container.addEventListener('click', () => {
            this.events.emit('card:selected', { id: this.container.dataset.id });
        });
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set category(value: string) {
        this.categoryElement.textContent = value;

        for (const key in categoryMap) {
            this.categoryElement.classList.toggle(
                categoryMap[key as CategoryKey],
                key === value
            );
        }
    }

    set image(value: string) {
        this.setImage(this.imageElement, value, this.title);
    }
}