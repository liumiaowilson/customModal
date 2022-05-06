import { LightningElement, api } from 'lwc';
import {
    defineModal,
    getModal,
} from 'c/customModalUtils';
import CustomModalBase from 'c/customModalBase';
import TemplateFragment from 'c/templateFragment';

const Modal = getModal();

export default class CustomModal extends Modal {
    static define = (modalClass, tagName) => {
        defineModal(modalClass, tagName, CustomModalBase);
    };

    static buildFragment = TemplateFragment.buildFragment;

    @api
    label = '';

    @api
    message = '';

    @api
    size = 'small';

    @api
    btnSaveText = '';

    @api
    btnCancelText = '';

    @api
    fragment = null;

    _state = {};

    _buttons = [];
    @api
    get buttons() {
        if(this._buttons && this._buttons.length) {
            return this._buttons;
        }
        else {
            const buttons = [];

            if(this.btnCancelText) {
                buttons.push({
                    name: 'cancel',
                    label: this.btnCancelText,
                    variant: 'neutral',
                });
            }

            if(this.btnSaveText) {
                buttons.push({
                    name: 'save',
                    label: this.btnSaveText,
                    variant: 'brand',
                });
            }

            return buttons;
        }
    }

    set buttons(val) {
        this._buttons = val;
    }

    @api
    get state() {
        return this.fragment ? this._state : null;
    }

    handleFragmentStateChange(e) {
        this._state = e.detail.state;
    }
}

defineModal(CustomModal, 'c-custom-modal', CustomModalBase);
