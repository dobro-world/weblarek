import { IEvents } from "../base/Events";
import { Card } from "./Card";

export class CatalogCard extends Card {
    constructor(protected events: IEvents, container: HTMLElement) {
        super(events, container);

        this.container.addEventListener('click', () => {
            this.events.emit('card:select');
        });
    }
}