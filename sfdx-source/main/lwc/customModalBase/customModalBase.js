import { LightningElement, api } from 'lwc';
import {
    defineModal,
    getModalBase,
    classSet,
} from 'c/customModalUtils';

const ModalBase = getModalBase();

const ButtonComputeProperties = [
    'label',
    'className',
    'variant',
    'disabled',
];

export default class CustomModalBase extends ModalBase {
    label = '';
    buttons = [];

    get customModalBaseHeaderClass() {
        return classSet('slds-modal__header')
            .add({
                'slds-hide': !this.label,
            })
            .toString();
    }

    get computedModalContentCssClasses() {
        const classes = classSet('slds-modal__content slds-p-around_medium');
        classes.add({
            'slds-modal__content_headless': !this.label,
        });
        return classes.toString();
    }

    get customModalBaseFooterClass() {
        return classSet('slds-modal__footer')
            .add({
                'slds-hide': this.buttons.length === 0,
            })
            .toString();
    }

    get computedButtons() {
        return this.buttons.map(btn => {
            const computedBtn = { ...btn };

            ButtonComputeProperties.forEach(prop => {
                if(typeof btn[prop] === 'function') {
                    computedBtn[prop] = btn[prop](this.modal.state);
                }

                if(prop === 'className') {
                    computedBtn[prop] = ['slds-m-left_x-small', computedBtn[prop]].filter(Boolean).join(' ');
                }
            });

            return computedBtn;
        });
    }

    handlePrivateChildRender(event) {
        event.stopPropagation();

        this.label = this.modal.label;
        this.buttons = this.modal.buttons;

        if(!this.isModalTransitioningIn) {
            this.queueShowModal();
        }
    }

    handleCloseClick(e) {
        this.executeButton('cancel');
    }

    handleButtonClick(e) {
        const name = e.target.dataset.name;
        this.executeButton(name);
    }

    executeButton(name) {
        let button = this.buttons.find(btn => btn.name === name);
        if(!button) {
            if(name === 'cancel') {
                button = {
                    name: 'cancel',
                };
            }

            if(!button) {
                return;
            }
        }

        const execute = button.execute || (state => state);

        return Promise.resolve(execute(this.modal.state)).then(data => {
            this.modal.close({
                button: button.name,
                data,
            });
        });
    }
}

defineModal(CustomModalBase, 'c-custom-modal-base');
