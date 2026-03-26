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
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errorText(value: string) {
        this.errors.textContent = value;
        if (value) {
            this.errors.style.display = 'block';
        } else {
            this.errors.style.display = 'none';
        }
    }
    
    showError(message: string) {
        this.errorText = message;
    }
    
    clearError() {
        this.errorText = '';
    }
}