import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBaseForm {
    valid: boolean;
    errorText: string;
}

export class BaseForm extends Component<IBaseForm> {
    protected formElement: HTMLFormElement;
    protected submitButton: HTMLButtonElement;
    protected errors: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.formElement = this.container as HTMLFormElement;
        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this.errors = ensureElement<HTMLElement>('.form__errors', this.container);
        
        this.formElement.addEventListener('submit', (e) => {
            e.preventDefault();

            const formName = this.formElement.name;

            if (formName === 'order') {
                this.events.emit('order:next');
                return;
            }

            if (formName === 'contacts') {
                this.events.emit('form:submit');
            }
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errorText(value: string) {
        this.errors.textContent = value;
        if (value) {
            this.errors.classList.add('form__errors_visible');
        } else {
            this.errors.classList.remove('form__errors_visible');
        }
    }

    clear() {
        this.formElement.reset();
        this.errorText = '';
    }
}