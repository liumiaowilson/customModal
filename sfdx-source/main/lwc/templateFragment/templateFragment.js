import { LightningElement, api } from 'lwc';

export default class TemplateFragment extends LightningElement {
    _tmpl = null;
    _state = {};
    _callbacks = {};

    @api attrName1;
    _attrValue1;
    @api
    get attrValue1() {
        return this._attrValue1;
    }

    set attrValue1(val) {
        this._attrValue1 = val;
        this.syncAttr(1);
    }

    @api attrName2;
    _attrValue2;
    @api
    get attrValue2() {
        return this._attrValue2;
    }

    set attrValue2(val) {
        this._attrValue2 = val;
        this.syncAttr(2);
    }

    @api attrName3;
    _attrValue3;
    @api
    get attrValue3() {
        return this._attrValue3;
    }

    set attrValue3(val) {
        this._attrValue3 = val;
        this.syncAttr(3);
    }

    syncAttr(num) {
        const attrName = this['attrName' + num];
        const attrValue = this['attrValue' + num];
        const updates = {
            [attrName]: attrValue,
        };

        this.setState(updates);
    }

    /*
     * TemplateFragment have {state} as variables
     *
     * {
     *     state: {
     *         name: "Wilson",
     *     },
     *     view: template,
     *     actions: fragment => ({
     *          onChange: e => { ... },
     *     }),
     *     callbacks: fragment => ({
     *         connectedCallback: () => { ... },
     *     }),
     *     style: `
     *     .red {
     *          color: red;
     *     }
     *     `,
     * }
     */
    _fragment;
    @api
    get fragment() {
        return this._fragment;
    }

    set fragment(val) {
        if(!val) {
            return;
        }

        this._fragment = val;
        if(typeof this._fragment === 'function') {
            this._fragment = {
                view: this._fragment,
            };
        }

        if(this._fragment.state) {
            this.setState(this._fragment.state);
        }

        if(this._fragment.actions) {
            const actions = this._fragment.actions(this);
            Object.keys(actions).forEach(key => {
                const action = actions[key];
                this[key] = action;
            });
        }

        if(this._fragment.callbacks) {
            this._callbacks = this._fragment.callbacks(this);
        }

        this._tmpl = null;
    }

    get state() {
        return this._state;
    }

    setState(updates) {
        if(!updates) {
            return;
        }

        const newState = {
            ...this.state,
            ...updates,
        };

        this._state = newState;

        this.dispatchEvent(new CustomEvent('statechange', {
            bubbles: false,
            composed: false,
            detail: {
                state: this._state,
            },
        }));
    }

    render() {
        if(!this._tmpl) {
            if(this._fragment.view) {
                this._tmpl = this._fragment.view;
            }
        }

        return this._tmpl;
    }

    connectedCallback() {
        if(this._callbacks && this._callbacks.connectedCallback) {
            this._callbacks.connectedCallback();
        }
    }

    disconnectedCallback() {
        if(this._callbacks && this._callbacks.disconnectedCallback) {
            this._callbacks.disconnectedCallback();
        }
    }

    renderedCallback() {
        if(this._callbacks && this._callbacks.renderedCallback) {
            this._callbacks.renderedCallback();
        }
    }

    errorCallback(error) {
        if(this._callbacks && this._callbacks.errorCallback) {
            this._callbacks.errorCallback(error);
        }
    }

    static buildFragment = fragment => {
        if(typeof fragment === 'function') {
            return fragment;
        }

        const tmpl = fragment.view;
        if(fragment.style) {
            const oldCssFn = tmpl.stylesheets[0];
            const cssFn = (token, useActualHostSelector, useNativeDirPseudoclass) => {
                const shadowSelector = token ? ("[" + token + "]") : "";
                return (oldCssFn ? oldCssFn(token, useActualHostSelector, useNativeDirPseudoclass) : '') + ' ' + fragment.style;
            };

            tmpl.stylesheets[0] = cssFn;
        }

        return fragment;
    };
}
